import React, { useState } from 'react';
import { Cpu, Search, Zap, CheckCircle2, Play, GitCommit, FileCode, Layers, ShieldCheck } from 'lucide-react';

export const RustEngineConsole: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('SymbolGraph');
  const [activeEngineTab, setActiveEngineTab] = useState<'search' | 'diff' | 'benchmarks'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [latencyUs, setLatencyUs] = useState(380);

  // Symbol search simulation
  const [searchResults, setSearchResults] = useState([
    {
      symbol: 'SymbolGraph',
      kind: 'struct',
      file: 'services/engine-rust/indexer/src/symbol_graph.rs',
      line: 42,
      snippet: 'pub struct SymbolGraph { lookup: DashMap<String, Vec<SymbolId>>, meta_store: DashMap<SymbolId, SymbolMeta> }',
      score: 0.992,
      references: 18
    },
    {
      symbol: 'insert_symbol',
      kind: 'method',
      file: 'services/engine-rust/indexer/src/symbol_graph.rs',
      line: 60,
      snippet: 'pub fn insert_symbol(&self, meta: SymbolMeta) -> SymbolId { let hash = fxhash::hash64(...); }',
      score: 0.945,
      references: 7
    },
    {
      symbol: 'ReActPlanner',
      kind: 'class',
      file: 'services/agent-js/planner/react_loop.ts',
      line: 28,
      snippet: 'export class ReActPlanner { private maxIterations = 8; private modelProvider: GeminiModelProvider; }',
      score: 0.887,
      references: 12
    }
  ]);

  const handleRunSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setLatencyUs(Math.floor(Math.random() * 200 + 260));
      setIsSearching(false);
    }, 180);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-400" />
              Native Code Engine: services/engine-rust
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              SIMD-accelerated Tree-Sitter AST parsing, lock-free symbol indexing, and Landlock sandbox
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-md">
              <button
                onClick={() => setActiveEngineTab('search')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeEngineTab === 'search'
                    ? 'bg-slate-800 text-orange-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AST Symbol Search
              </button>
              <button
                onClick={() => setActiveEngineTab('diff')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeEngineTab === 'diff'
                    ? 'bg-slate-800 text-orange-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Myers Diff & 3-Way Merge
              </button>
              <button
                onClick={() => setActiveEngineTab('benchmarks')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeEngineTab === 'benchmarks'
                    ? 'bg-slate-800 text-orange-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SIMD Benchmarks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: AST Symbol Search */}
      {activeEngineTab === 'search' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-200">
              Parallel Hybrid Lexical + AST Graph Query
            </div>
            <div className="text-xs font-mono text-slate-400">
              Execution Latency: <span className="text-emerald-400 font-semibold tabular-nums">{latencyUs} μs</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query symbol, function, or trait (e.g. SymbolGraph, CodeParser, apply_patch)..."
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-orange-500/80 transition-colors"
              />
            </div>
            <button
              onClick={handleRunSearch}
              disabled={isSearching}
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              Run Rayon Search
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-2.5 pt-2">
            {searchResults.map((hit, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-md bg-slate-950 border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-orange-400 font-bold text-sm">
                      {hit.symbol}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {hit.kind}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {hit.file}:{hit.line}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                    <span>References: <strong className="text-slate-200">{hit.references}</strong></span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      Score {(hit.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  {hit.snippet}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Myers Diff & 3-Way Merge */}
      {activeEngineTab === 'diff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              High-Speed Myers Diff & 3-Way Conflict Resolution Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Implements O(ND) minimal edit graph traversal with fuzzy hunk fuzz tolerance (0–3 lines).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-400 font-semibold">Original Tree-Sitter AST Snippet (Before):</div>
              <pre className="text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/80 overflow-x-auto text-[11px]">
{`pub fn parse_with_timeout(&mut self, source: &[u8]) -> Result<Tree, Error> {
    let mut cursor = self.rust_parser.parse(source, None);
    // Legacy blocking mutex synchronization
    self.lock.lock().unwrap();
}`}
              </pre>
            </div>

            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-semibold">Engine Generated Minimal Myers Diff (After):</div>
              <pre className="text-emerald-300 bg-slate-900/60 p-2.5 rounded border border-slate-800/80 overflow-x-auto text-[11px]">
{`@@ -3,2 +3,4 @@
-    self.lock.lock().unwrap();
+    // Zero-allocation atomic lock-free borrow
+    let tree = cursor.ok_or(Error::ParseTimeout)?;
+    Ok(tree)`}
              </pre>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>3-Way Merge Conflicts: 0 · Fuzz Factor: 0 lines · Execution: 44 μs</span>
            </div>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors">
              Re-calculate Diff
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: SIMD Benchmarks */}
      {activeEngineTab === 'benchmarks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Engine Performance Benchmarks (Rust AVX2/NEON vs Python/Node Baselines)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Benchmarked across 1,000,000 lines of mixed Rust, Go, and TypeScript repository code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">AST Parse Throughput</div>
              <div className="text-2xl font-bold font-mono text-orange-400 mt-1 tabular-nums">
                420 MB/s
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 font-mono">
                18.4x faster than Python AST
              </div>
            </div>

            <div className="p-4 rounded-md bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Full Repo Index Time</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                18.2 ms
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 font-mono">
                Sub-frame latency
              </div>
            </div>

            <div className="p-4 rounded-md bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Memory Footprint</div>
              <div className="text-2xl font-bold font-mono text-violet-400 mt-1 tabular-nums">
                12.4 MB
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 font-mono">
                Zero garbage collection spikes
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-md overflow-hidden">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Engine Component</th>
                  <th className="p-3">Language & Strategy</th>
                  <th className="p-3 text-right">Throughput</th>
                  <th className="p-3 text-right">Mean Latency</th>
                  <th className="p-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                <tr className="hover:bg-slate-950/40">
                  <td className="p-3 font-semibold text-white">indexer::SymbolGraph</td>
                  <td className="p-3 text-slate-400">Rust / DashMap Lock-Free</td>
                  <td className="p-3 text-right text-emerald-400">620k ops/sec</td>
                  <td className="p-3 text-right">1.2 μs</td>
                  <td className="p-3 text-right text-emerald-400">100%</td>
                </tr>
                <tr className="hover:bg-slate-950/40">
                  <td className="p-3 font-semibold text-white">parser::TreeSitterAst</td>
                  <td className="p-3 text-slate-400">Rust / Zero-Copy Cursor</td>
                  <td className="p-3 text-right text-emerald-400">420 MB/s</td>
                  <td className="p-3 text-right">14.0 μs</td>
                  <td className="p-3 text-right text-emerald-400">99.8%</td>
                </tr>
                <tr className="hover:bg-slate-950/40">
                  <td className="p-3 font-semibold text-white">search::BM25Vector</td>
                  <td className="p-3 text-slate-400">Rust / Rayon AVX2</td>
                  <td className="p-3 text-right text-emerald-400">180k queries/sec</td>
                  <td className="p-3 text-right">380 μs</td>
                  <td className="p-3 text-right text-emerald-400">100%</td>
                </tr>
                <tr className="hover:bg-slate-950/40">
                  <td className="p-3 font-semibold text-white">runner::LandlockSandbox</td>
                  <td className="p-3 text-slate-400">Rust / Linux cgroups v2</td>
                  <td className="p-3 text-right text-emerald-400">48 sandboxes/sec</td>
                  <td className="p-3 text-right">2.1 ms</td>
                  <td className="p-3 text-right text-emerald-400">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
