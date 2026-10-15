# DevMind AI: Autonomous Multi-Agent Software Engineering Platform

DevMind AI is an enterprise-grade autonomous software engineering ecosystem combining an interactive Web workspace, intelligent agent orchestration, Go-based distributed API gateway, and an ultra-high performance Rust code intelligence engine.

## Monorepo Architecture Overview

```
devmind-ai/
├── apps/
│   ├── web/                    # React interface & interactive agent workspace
│   └── desktop/                # Cross-platform desktop shell (Tauri/Rust)
├── services/
│   ├── agent-js/               # JavaScript AI agent orchestration runtime
│   │   ├── planner/            # ReAct reasoning loop, DAG task scheduler
│   │   ├── context/            # AST-guided context window & token budget
│   │   ├── tools/              # Sandboxed shell, AST grep, git patcher
│   │   ├── providers/          # Gemini 2.5 Flash / Pro adapters
│   │   └── evaluator/          # SWE-bench regression test verification
│   ├── api-go/                 # Distributed Go backend & API gateway
│   │   ├── auth/               # RBAC security & JWT sessions
│   │   ├── projects/           # Git repository sync & branch isolation
│   │   ├── workspaces/         # Docker/cgroup sandbox container orchestrator
│   │   ├── tasks/              # Real-time event streaming & queue handler
│   │   └── audit/              # Immutable SHA-256 telemetry trail
│   └── engine-rust/             # High-performance native code engine
│       ├── indexer/            # Concurrent symbol graph & inverted index
│       ├── parser/             # Tree-sitter AST queries with zero-alloc slicing
│       ├── search/             # SIMD-accelerated BM25 + vector hybrid search
│       ├── patches/            # Unified diff parser & 3-way merge resolver
│       └── runner/             # Linux Landlock & cgroups v2 test sandbox
├── packages/
│   ├── shared-contracts/       # Protobuf & TypeScript contract schemas
│   └── editor-components/      # Diff viewers & inline code intelligence
├── infrastructure/             # Docker compose, Postgres, ClickHouse, Prometheus
├── datasets/                   # SWE-bench task specs & evaluation harnesses
├── docs/                       # Architectural specifications & RFCs
├── tests/                      # End-to-end integration test suites
└── docker-compose.yml          # Unified multi-service orchestration
```

## Getting Started

1. **Start Dev Server**: `npm run dev`
2. **Access Web Console**: Visit `http://localhost:3000`
3. **Configure Gemini Key**: Set `GEMINI_API_KEY` in your environment or use the local deterministic agent planner.
