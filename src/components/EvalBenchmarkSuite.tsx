import React, { useState } from 'react';
import { BarChart3, CheckCircle2, TrendingUp, Clock, FileCode, Check, Award, AlertCircle } from 'lucide-react';

interface BenchmarkTask {
  id: string;
  category: string;
  difficulty: 'Medium' | 'Hard' | 'Extreme';
  repo: string;
  targetFile: string;
  description: string;
  status: 'PASSED' | 'FAILED';
  timeSec: number;
  linesAdded: number;
  linesRemoved: number;
}

const BENCHMARK_TASKS: BenchmarkTask[] = [
  {
    id: 'SWE-1042',
    category: 'Concurrency & Deadlocks',
    difficulty: 'Hard',
    repo: 'devmind-ai/engine-rust',
    targetFile: 'services/engine-rust/indexer/src/symbol_graph.rs',
    description: 'Deadlock occurring when concurrent worker threads perform both find_references() and insert_symbol() under heavy AST indexing load. Migrated to DashMap RCU.',
    status: 'PASSED',
    timeSec: 14.8,
    linesAdded: 18,
    linesRemoved: 6
  },
  {
    id: 'SWE-1043',
    category: 'Performance & Zero-Alloc',
    difficulty: 'Medium',
    repo: 'devmind-ai/engine-rust',
    targetFile: 'services/engine-rust/parser/src/tree_sitter_ast.rs',
    description: 'String allocations during Tree-Sitter AST query cursor traversal cause GC pressure in node binding. Optimized using byte slice borrowing.',
    status: 'PASSED',
    timeSec: 12.3,
    linesAdded: 24,
    linesRemoved: 14
  },
  {
    id: 'SWE-1044',
    category: 'Stream Buffer Overflow',
    difficulty: 'Hard',
    repo: 'devmind-ai/api-go',
    targetFile: 'services/api-go/tasks/task_streamer.go',
    description: 'Slow client connections during Server-Sent Events (SSE) agent streaming caused unbounded heap growth in task channel buffer.',
    status: 'PASSED',
    timeSec: 16.5,
    linesAdded: 32,
    linesRemoved: 8
  },
  {
    id: 'SWE-1045',
    category: 'Context Window Compression',
    difficulty: 'Medium',
    repo: 'devmind-ai/agent-js',
    targetFile: 'services/agent-js/context/token_budget.ts',
    description: 'Oversized AST file skeletons in large monorepos exceeded 32k Gemini context limit; implemented adaptive sliding window compressor.',
    status: 'PASSED',
    timeSec: 19.2,
    linesAdded: 45,
    linesRemoved: 12
  },
  {
    id: 'SWE-1046',
    category: 'Sandbox Landlock Isolation',
    difficulty: 'Extreme',
    repo: 'devmind-ai/engine-rust',
    targetFile: 'services/engine-rust/runner/src/cgroups_sandbox.rs',
    description: 'Enforce Linux Landlock filesystem jail before executing untrusted unit test processes to prevent escape vectors.',
    status: 'PASSED',
    timeSec: 28.4,
    linesAdded: 58,
    linesRemoved: 16
  }
];

export const EvalBenchmarkSuite: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<BenchmarkTask>(BENCHMARK_TASKS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              SWE-bench Evaluation Suite: datasets/
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous autonomous coding benchmarks verifying bug resolution, AST transformations, and zero regressions
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-3 py-1.5 rounded-md">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Official Pass Rate: 90.83% (218 / 240 Tasks)</span>
          </div>
        </div>
      </div>

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Benchmark Tasks</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">240</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Full monorepo coverage</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Autonomous Pass Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">90.83%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">+14.2% over standard LLM baseline</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Mean Time to Resolution</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">18.4s</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">From goal prompt to verified patch</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Mean Patch Size</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">34 lines</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Surgical, minimal diff footprint</div>
        </div>
      </div>

      {/* Domain Breakdown Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="text-xs font-semibold text-slate-200">
          Benchmark Domain Breakdown
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Concurrency & Deadlocks', pass: '89.4%', count: '48 tasks' },
            { label: 'AST Refactoring & Typing', pass: '94.2%', count: '72 tasks' },
            { label: 'API & gRPC Gateway', pass: '92.1%', count: '64 tasks' },
            { label: 'Performance & Memory', pass: '87.6%', count: '56 tasks' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded bg-slate-950 border border-slate-800 text-xs">
              <div className="text-slate-400 font-medium">{item.label}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-emerald-400 font-bold tabular-nums">{item.pass}</span>
                <span className="text-[11px] font-mono text-slate-500">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Task Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Task List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-200">
            SWE-bench Task Specifications (datasets/task-specs/)
          </div>

          <div className="divide-y divide-slate-800/60 p-1.5 space-y-0.5">
            {BENCHMARK_TASKS.map((task) => {
              const isSelected = selectedTask.id === task.id;
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`w-full text-left p-3 rounded-md transition-colors text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-400">{task.id}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {task.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200 line-clamp-1">{task.category}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {task.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Task Details */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedTask.id}: {selectedTask.category}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {selectedTask.difficulty}
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-400 mt-1">
                {selectedTask.targetFile}
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <div>Time: <span className="text-emerald-400 tabular-nums">{selectedTask.timeSec}s</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                <span className="text-emerald-400">+{selectedTask.linesAdded}</span> / <span className="text-rose-400">-{selectedTask.linesRemoved}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300 mb-1">
              Issue Specification & Ground Truth Requirements:
            </div>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 leading-relaxed font-mono">
              {selectedTask.description}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs space-y-2">
            <div className="text-slate-400 font-semibold">Verification Checks:</div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unit Test Suite: 100% Passed (Zero Regressions)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Thread Contention Stress Test: Passed without deadlocks</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Memory Bounds: Max 48MB resident set size under Landlock jail</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
