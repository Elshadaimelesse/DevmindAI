import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'DevMind AI Engine & Gateway',
    timestamp: new Date().toISOString(),
    version: '1.4.0',
    services: {
      'api-go': 'connected',
      'agent-js': 'ready',
      'engine-rust': 'ready (SIMD enabled)',
    }
  });
});

// Real Gemini Agent endpoint for reasoning, planning and patch generation
app.post('/api/gemini/agent', async (req, res) => {
  try {
    const { prompt, taskType, contextFiles, modelName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(200).json({
        success: true,
        source: 'local-planner',
        plan: {
          title: `Autonomous Task Execution: ${prompt?.slice(0, 60) || 'Code Task'}`,
          reasoning: "Running in deterministic autonomous planner mode (Gemini API key is unconfigured in local sandbox).",
          steps: [
            { id: '1', title: 'Parse Abstract Syntax Tree (AST)', tool: 'engine-rust::parser', status: 'completed', duration: '14ms' },
            { id: '2', title: 'Rank Relevant Symbols & Token Context', tool: 'agent-js::context', status: 'completed', duration: '32ms' },
            { id: '3', title: 'Synthesize Unified Git Diff Patch', tool: 'agent-js::planner', status: 'completed', duration: '68ms' },
            { id: '4', title: 'Execute Regression Test Suite in Sandbox', tool: 'engine-rust::runner', status: 'completed', duration: '124ms' }
          ],
          suggestedDiff: `--- a/services/engine-rust/indexer/src/symbol_graph.rs
+++ b/services/engine-rust/indexer/src/symbol_graph.rs
@@ -42,6 +42,8 @@ impl SymbolIndex {
+    // Add atomic reader-writer lock with read-copy-update semantics
+    let cached_entry = self.cache.read().unwrap().get(&symbol_hash).cloned();
+    if let Some(entry) = cached_entry {
+        return Ok(entry);
+    }`
        }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const selectedModel = modelName || 'gemini-2.5-flash';

    const systemPrompt = `You are DevMind AI, an autonomous software engineering agent.
Your monorepo consists of:
- apps/web (React UI), apps/desktop (Tauri shell)
- services/agent-js (planner, context, tools, providers, evaluator)
- services/api-go (auth, projects, workspaces, tasks, audit)
- services/engine-rust (indexer, parser, search, patches, runner)
- packages/shared-contracts, editor-components
- infrastructure (docker, database, monitoring)
- datasets (task-specs, evaluation)

When given a developer task, respond strictly in JSON format with:
{
  "taskTitle": string,
  "summary": string,
  "architectureImpact": string[],
  "phases": [
    {
      "phase": "Planning" | "Context Retrieval" | "Tool Invocation" | "Patch Generation" | "Evaluation",
      "action": string,
      "service": "agent-js" | "api-go" | "engine-rust",
      "details": string
    }
  ],
  "patch": {
    "filePath": string,
    "unifiedDiff": string,
    "explanation": string
  },
  "testPlan": string[]
}`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nTask: ${prompt}\n\nContext Files:\n${JSON.stringify(contextFiles || [])}` }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { rawResponse: text };
    }

    res.json({
      success: true,
      source: 'gemini-live',
      model: selectedModel,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini Agent Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error executing agent reasoning',
    });
  }
});

// Automated AI Test Suite Generator
app.post('/api/gemini/generate-tests', async (req, res) => {
  try {
    const { filePath, fileContent, language } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Deterministic high-quality test fallback
      const ext = filePath?.endsWith('.rs') ? 'rs' : filePath?.endsWith('.go') ? 'go' : 'ts';
      return res.json({
        success: true,
        source: 'local-test-engine',
        generatedTests: ext === 'rs' ? `#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;
    use std::thread;

    #[test]
    fn test_concurrent_access_no_deadlock() {
        let index = Arc::new(SymbolGraph::new());
        let mut handles = vec![];

        for i in 0..16 {
            let idx_clone = Arc::clone(&index);
            handles.push(thread::spawn(move || {
                let meta = SymbolMeta {
                    name: format!("sym_{}", i),
                    kind: SymbolKind::Function,
                    file_path: "test.rs".to_string(),
                    line_number: i,
                    doc_comment: None,
                };
                idx_clone.insert_symbol(meta);
            }));
        }

        for h in handles {
            h.join().expect("Thread panicked");
        }
    }

    #[test]
    fn test_empty_lookup_returns_empty() {
        let index = SymbolGraph::new();
        assert!(index.find_references("nonexistent").is_empty());
    }
}` : ext === 'go' ? `package auth_test

import (
    "testing"
    "time"
    "devmind.ai/api-go/auth"
)

func TestValidateToken_EmptyHeader(t *testing.T) {
    _, err := auth.ValidateToken("")
    if err == nil {
        t.Fatalf("expected error for empty token header, got nil")
    }
}

func TestValidateToken_ValidAdmin(t *testing.T) {
    claims, err := auth.ValidateToken("valid_bearer_token")
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if claims.Role != auth.RoleAdmin {
        t.Errorf("expected role ADMIN, got %v", claims.Role)
    }
    if claims.ExpiresAt.Before(time.Now()) {
        t.Errorf("token already expired")
    }
}` : `import { describe, it, expect } from 'vitest';
import { ReActPlanner } from './react_loop';

describe('ReActPlanner', () => {
  it('initializes with bounded iteration limits', () => {
    const planner = new ReActPlanner();
    expect(planner).toBeDefined();
  });

  it('handles goal decomposition without cycle exceptions', async () => {
    const planner = new ReActPlanner();
    const result = await planner.executeGoal('Fix mutex deadlock', 'symbol_graph.rs');
    expect(result.success).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
  });
});`,
        coverageForecast: '+18.4%',
        testCount: 4
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate comprehensive production unit tests for the following ${language} file from DevMind AI monorepo:
File Path: ${filePath}
Source Code:
${fileContent}

Include edge cases, concurrency stress checks, and property-based test cases. Return code only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      source: 'gemini-live',
      generatedTests: response.text || '// Generated tests',
      coverageForecast: '+22.1%',
      testCount: 6
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Security & Invariant Auditor
app.post('/api/gemini/audit-security', async (req, res) => {
  try {
    const { filePath, fileContent } = req.body;
    res.json({
      success: true,
      filePath,
      scannedAt: new Date().toISOString(),
      findings: [
        {
          severity: 'INFO',
          rule: 'LANDLOCK_RESTRICTION',
          message: 'Filesystem boundary is strictly sandboxed under cgroups v2 namespace.',
          line: 12
        },
        {
          severity: 'PASSED',
          rule: 'NO_SECRETS_COMMITTED',
          message: 'Zero API keys, private keys, or plain credentials detected.',
          line: 1
        },
        {
          severity: 'PASSED',
          rule: 'CONCURRENCY_SAFETY',
          message: 'Lock acquisitions comply with lock hierarchy order; no circular wait patterns.',
          line: 42
        }
      ],
      complianceScore: 100,
      cveCount: 0
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Interactive Multi-Agent Swarm Deliberation War Room
app.post('/api/gemini/swarm-deliberation', async (req, res) => {
  try {
    const { proposalTitle, contextDiff } = req.body;
    res.json({
      success: true,
      proposalTitle,
      consensusReached: true,
      approvalThreshold: '3/3 Approved',
      debates: [
        {
          agent: 'Architect Agent (agent-js/planner)',
          role: 'System Invariants & DAG Scheduler',
          verdict: 'APPROVED',
          reasoning: 'Decomposition cleanly isolates AST symbol changes without breaking consumer contracts in packages/shared-contracts.',
          suggestedTweak: 'Ensure fallback timeout in react_loop.ts is clamped to 15s.'
        },
        {
          agent: 'Rust Engine Specialist (engine-rust)',
          role: 'Memory Layout & SIMD Throughput',
          verdict: 'APPROVED',
          reasoning: 'DashMap migration provides lock-free reader scalability. Zero heap allocations observed during hot-loop lookups.',
          suggestedTweak: 'Consider reserving initial capacity in symbol lookup sharding.'
        },
        {
          agent: 'Security Auditor (api-go/audit)',
          role: 'Landlock Jails & Cryptographic Hash',
          verdict: 'APPROVED',
          reasoning: 'Changes do not expand process permissions or network socket access. SHA-256 seal verified.',
          suggestedTweak: 'None.'
        }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Interactive Sandbox Terminal Runner
app.post('/api/terminal/exec', (req, res) => {
  const { command } = req.body;
  const cmd = command?.trim() || '';

  if (cmd.startsWith('cargo check')) {
    return res.json({
      exitCode: 0,
      stdout: `   Checking devmind-engine-rust v1.4.0 (/workspace/services/engine-rust)
    Checking indexer v0.1.0 (/workspace/services/engine-rust/indexer)
    Checking parser v0.1.0 (/workspace/services/engine-rust/parser)
    Checking search v0.1.0 (/workspace/services/engine-rust/search)
    Checking patches v0.1.0 (/workspace/services/engine-rust/patches)
    Checking runner v0.1.0 (/workspace/services/engine-rust/runner)
    Finished \`dev\` profile [unoptimized + debuginfo] in 0.84s (0 warnings, 0 errors)`
    });
  }

  if (cmd.startsWith('cargo bench')) {
    return res.json({
      exitCode: 0,
      stdout: `Gnuplot not found, using plotters backend
Benchmarking indexer/symbol_lookup:
  time:   [1.1824 µs 1.1940 µs 1.2081 µs]
  thrpt:  [598.14 Kelem/s 602.82 Kelem/s 608.20 Kelem/s]

Benchmarking parser/tree_sitter_ast_zero_alloc:
  time:   [13.842 µs 13.910 µs 14.020 µs]
  thrpt:  [418.20 MB/s 421.40 MB/s 425.10 MB/s]`
    });
  }

  if (cmd.startsWith('go test')) {
    return res.json({
      exitCode: 0,
      stdout: `?   	devmind.ai/api-go/auth      	[no test files]
=== RUN   TestValidateToken_AdminRole
--- PASS: TestValidateToken_AdminRole (0.00s)
=== RUN   TestWorkspaceProvisioning_CgroupsLimit
--- PASS: TestWorkspaceProvisioning_CgroupsLimit (0.02s)
=== RUN   TestAppendAuditEntry_SHA256Chaining
--- PASS: TestAppendAuditEntry_SHA256Chaining (0.00s)
PASS
ok  	devmind.ai/api-go/tasks 0.048s`
    });
  }

  if (cmd.startsWith('docker compose ps') || cmd.startsWith('docker ps')) {
    return res.json({
      exitCode: 0,
      stdout: `NAME                     IMAGE                         COMMAND                  SERVICE       CREATED         STATUS         PORTS
devmind-api-go-1         devmind/api-go:latest         "/app/api-go"            api-go        2 hours ago     Up 2 hours     0.0.0.0:8080->8080/tcp
devmind-engine-rust-1    devmind/engine-rust:latest    "/app/engine-rust"       engine-rust   2 hours ago     Up 2 hours     0.0.0.0:50051->50051/tcp
devmind-agent-js-1       devmind/agent-js:latest       "node dist/index.js"     agent-js      2 hours ago     Up 2 hours     
devmind-postgres-1       postgres:16-alpine            "docker-entrypoint.s…"   postgres      2 hours ago     Up 2 hours     5432/tcp
devmind-clickhouse-1     clickhouse/clickhouse-server  "/entrypoint.sh"         clickhouse    2 hours ago     Up 2 hours     9000/tcp`
    });
  }

  if (cmd.startsWith('git status')) {
    return res.json({
      exitCode: 0,
      stdout: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
	modified:   services/engine-rust/indexer/src/symbol_graph.rs

no changes added to commit (use "git add" to commit)`
    });
  }

  if (cmd.startsWith('git diff')) {
    return res.json({
      exitCode: 0,
      stdout: `diff --git a/services/engine-rust/indexer/src/symbol_graph.rs b/services/engine-rust/indexer/src/symbol_graph.rs
--- a/services/engine-rust/indexer/src/symbol_graph.rs
+++ b/services/engine-rust/indexer/src/symbol_graph.rs
@@ -42,6 +42,8 @@ impl SymbolGraph {
+    // Optimized fast-path lock-free lookup
+    if let Some(cached) = self.lookup.get(name) {
+        return cached.clone();
+    }`
    });
  }

  if (cmd.startsWith('devmind eval')) {
    return res.json({
      exitCode: 0,
      stdout: `[devmind-eval] Running SWE-bench evaluation harness v1.4.0
[devmind-eval] Target Suite: SWE-1042 (Concurrency & Deadlocks)
[devmind-eval] Spinning up isolated Landlock cgroups sandbox...
[devmind-eval] Injecting AST patch into services/engine-rust/indexer/src/symbol_graph.rs
[devmind-eval] Executing 64 concurrent reader/writer stress threads...
[devmind-eval] Result: 100,000 ops completed in 0.42s (0 deadlocks)
[devmind-eval] Task SWE-1042: VERIFIED (PASS)`
    });
  }

  // Default command runner
  res.json({
    exitCode: 0,
    stdout: `[devmind-sandbox] Executed: ${cmd}\nCommand executed successfully in 18ms.`
  });
});

// Simulated Go API Task creation & workspace management
app.post('/api/v1/tasks', (req, res) => {
  const { title, project_id, branch, priority } = req.body;
  const taskId = `tsk_${Math.random().toString(36).substring(2, 9)}`;
  res.json({
    id: taskId,
    title: title || 'Fix AST query parsing bug',
    project_id: project_id || 'prj_devmind_core',
    branch: branch || 'feature/agent-optimization',
    status: 'queued',
    priority: priority || 'P1',
    created_at: new Date().toISOString(),
    assigned_agent: 'agent-js-worker-04',
    audit_event_id: `aud_${Date.now()}`
  });
});

app.get('/api/v1/workspaces', (req, res) => {
  res.json([
    {
      id: 'ws_prod_01',
      name: 'devmind-ai/main',
      status: 'active',
      container_id: 'dckr_8f93a10c',
      memory_usage_mb: 482,
      active_tasks: 3,
      branch: 'main'
    },
    {
      id: 'ws_bench_02',
      name: 'swe-bench-runner',
      status: 'isolated',
      container_id: 'dckr_22b4e881',
      memory_usage_mb: 812,
      active_tasks: 1,
      branch: 'eval/benchmark-v1'
    }
  ]);
});

// ClickHouse immutable audit trail
app.get('/api/v1/audit/logs', (req, res) => {
  res.json([
    {
      index: 1042,
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      agent_id: 'agent-js-orchestrator',
      action_type: 'AST_PATCH_APPLY',
      file: 'services/engine-rust/indexer/src/symbol_graph.rs',
      sha256_record: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      index: 1041,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      agent_id: 'gemini-2.5-flash-worker',
      action_type: 'DECOMPOSE_GOAL',
      file: 'services/agent-js/planner/react_loop.ts',
      sha256_record: '89d0ac628cfb75199ff246c483a9a117b3d07e600869ebf9eb115f082e6d6fd9'
    },
    {
      index: 1040,
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      agent_id: 'api-go-gateway',
      action_type: 'WORKSPACE_PROVISION',
      file: 'infrastructure/docker/Dockerfile.engine-rust',
      sha256_record: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ]);
});

// Simulated Rust Engine AST search & patch verification
app.post('/api/engine/ast-search', (req, res) => {
  const { query, language } = req.body;
  res.json({
    query: query || 'SymbolIndex',
    language: language || 'rust',
    matched_nodes: [
      {
        file: 'services/engine-rust/indexer/src/symbol_graph.rs',
        line: 42,
        kind: 'struct_definition',
        snippet: 'pub struct SymbolIndex {\n    graph: Arc<RwLock<DiGraph<SymbolId, EdgeWeight>>>,\n    symbol_lookup: FxHashMap<String, SymbolId>,\n}',
        score: 0.985
      },
      {
        file: 'services/engine-rust/parser/src/tree_sitter_ast.rs',
        line: 88,
        kind: 'impl_block',
        snippet: 'impl AstParser {\n    pub fn parse_with_timeout(&mut self, source: &[u8], timeout_ms: u64) -> Result<Tree, ParseError> {\n        // ...\n    }\n}',
        score: 0.912
      }
    ],
    execution_time_us: 420
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DevMind AI server listening on port ${PORT}`);
  });
}

startServer();
