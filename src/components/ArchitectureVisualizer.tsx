import React, { useState } from 'react';
import { BookOpen, Layers, Shield, Cpu, Network, Database, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArchitectureVisualizer: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('agent');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          DevMind AI Technical Architecture & Monorepo Topology
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          High-performance multi-tier engineering platform decoupling reasoning, API orchestration, and SIMD code parsing
        </p>
      </div>

      {/* Interactive Topology Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="text-xs font-semibold text-slate-200">
          Decoupled Multi-Service Flow Architecture
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Box 1: Client */}
          <div
            onClick={() => setSelectedTier('client')}
            className={`p-4 rounded-lg border transition-all cursor-pointer text-xs space-y-2 ${
              selectedTier === 'client'
                ? 'bg-slate-800 border-cyan-500 shadow-xs'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold">apps/</span>
              <span className="text-[10px] text-slate-500">Tier 1</span>
            </div>
            <div className="font-semibold text-slate-200">Web & Desktop Shell</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              React 19 workspace UI and optional Tauri native desktop shell communicating via SSE & gRPC.
            </p>
          </div>

          {/* Box 2: API Gateway */}
          <div
            onClick={() => setSelectedTier('api')}
            className={`p-4 rounded-lg border transition-all cursor-pointer text-xs space-y-2 ${
              selectedTier === 'api'
                ? 'bg-slate-800 border-emerald-500 shadow-xs'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-400 font-bold">services/api-go/</span>
              <span className="text-[10px] text-slate-500">Tier 2</span>
            </div>
            <div className="font-semibold text-slate-200">Go Distributed Gateway</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              High-concurrency routing, JWT RBAC, workspace container pool, and SHA-256 audit trails.
            </p>
          </div>

          {/* Box 3: Agent Orchestrator */}
          <div
            onClick={() => setSelectedTier('agent')}
            className={`p-4 rounded-lg border transition-all cursor-pointer text-xs space-y-2 ${
              selectedTier === 'agent'
                ? 'bg-slate-800 border-yellow-500 shadow-xs'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-yellow-400 font-bold">services/agent-js/</span>
              <span className="text-[10px] text-slate-500">Tier 3</span>
            </div>
            <div className="font-semibold text-slate-200">Agent Reasoning Runtime</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ReAct loop, AST-guided context reduction, Gemini 2.5 Flash / Pro adapters, and SWE-bench evaluator.
            </p>
          </div>

          {/* Box 4: Rust Engine */}
          <div
            onClick={() => setSelectedTier('rust')}
            className={`p-4 rounded-lg border transition-all cursor-pointer text-xs space-y-2 ${
              selectedTier === 'rust'
                ? 'bg-slate-800 border-orange-500 shadow-xs'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-orange-400 font-bold">services/engine-rust/</span>
              <span className="text-[10px] text-slate-500">Tier 4</span>
            </div>
            <div className="font-semibold text-slate-200">Native SIMD Code Engine</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tree-Sitter zero-copy AST parsing, lock-free SymbolGraph, SIMD BM25 search, and Landlock isolation.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Tier Deep-Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Component Details & Inter-Service IPC Contracts
        </h3>

        {selectedTier === 'agent' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="font-semibold text-yellow-400 font-mono">
              services/agent-js/ — Autonomous Multi-Agent Reasoning Architecture
            </div>
            <p>
              The JavaScript agent service manages the ReAct (Reasoning + Acting) loop. When a developer submits a goal, the planner decomposes the objective into an atomic Directed Acyclic Graph (DAG) of subtasks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">planner/</div>
                <div>react_loop.ts: Bounded step loop with reasoning scratchpad</div>
                <div>subtask_graph.ts: DAG topological scheduler</div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">context/</div>
                <div>ast_pruner.ts: Slices irrelevant function bodies</div>
                <div>token_budget.ts: 32k sliding window allocation</div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">evaluator/</div>
                <div>swe_bench.ts: Official benchmark harness</div>
                <div>regression_gate.ts: Pre-commit safety invariants</div>
              </div>
            </div>
          </div>
        )}

        {selectedTier === 'rust' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="font-semibold text-orange-400 font-mono">
              services/engine-rust/ — High-Throughput Native SIMD Code Intelligence
            </div>
            <p>
              Heavy syntactic and semantic operations are offloaded from Node.js to native Rust. Compiled with AVX2 and NEON SIMD vector extensions, the engine can index 1,000,000 lines of code in under 20 milliseconds.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-orange-400 font-bold mb-1">indexer/</div>
                <div>symbol_graph.rs: Lock-free DashMap definition lookup</div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-orange-400 font-bold mb-1">parser/ & search/</div>
                <div>tree_sitter_ast.rs: Zero-alloc AST cursor</div>
                <div>bm25_vector.rs: Rayon parallel hybrid search</div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-orange-400 font-bold mb-1">patches/ & runner/</div>
                <div>unified_diff.rs: Myers diff & 3-way merge</div>
                <div>cgroups_sandbox.rs: Landlock chroot jail</div>
              </div>
            </div>
          </div>
        )}

        {selectedTier === 'api' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="font-semibold text-emerald-400 font-mono">
              services/api-go/ — Distributed API Gateway & Orchestration
            </div>
            <p>
              Written in Go for concurrency and resource efficiency, the gateway provides HTTP/2 REST and gRPC endpoints. It manages git mirrors, isolates developer sandbox containers, and enforces cryptographic audit logging.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">auth/ & projects/</div>
                <div>jwt_rbac.go: Role claims validation</div>
                <div>repository_sync.go: Bare git mirror isolation</div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">workspaces/ & tasks/</div>
                <div>sandbox_orchestrator.go: Container jails</div>
                <div>task_streamer.go: SSE event streaming</div>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">audit/</div>
                <div>immutable_logger.go: SHA-256 chained ledger</div>
              </div>
            </div>
          </div>
        )}

        {selectedTier === 'client' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="font-semibold text-cyan-400 font-mono">
              apps/ — Client Workspace & Desktop Shell
            </div>
            <p>
              Provides unified engineering surfaces: React 19 for the Web IDE with streaming agent traces, diff viewers, and monorepo code navigation; and Tauri for local native performance with offline capabilities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
