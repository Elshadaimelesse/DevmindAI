import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, CornerDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface CommandHistoryItem {
  command: string;
  output: string;
  exitCode: number;
  timestamp: string;
}

const QUICK_COMMANDS = [
  'cargo check --workspace',
  'cargo bench --bench simd_ast',
  'go test -v ./services/api-go/...',
  'devmind eval run --suite SWE-1042',
  'docker compose ps',
  'git status',
  'git diff'
];

export const InteractiveTerminal: React.FC = () => {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'devmind eval run --suite SWE-1042',
      output: `[devmind-eval] Running SWE-bench evaluation harness v1.4.0
[devmind-eval] Target Suite: SWE-1042 (Concurrency & Deadlocks)
[devmind-eval] Spinning up isolated Landlock cgroups sandbox...
[devmind-eval] Injecting AST patch into services/engine-rust/indexer/src/symbol_graph.rs
[devmind-eval] Executing 64 concurrent reader/writer stress threads...
[devmind-eval] Result: 100,000 ops completed in 0.42s (0 deadlocks)
[devmind-eval] Task SWE-1042: VERIFIED (PASS)`,
      exitCode: 0,
      timestamp: '22:38:12'
    }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || inputCommand).trim();
    if (!cmd) return;

    if (cmd === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    setIsExecuting(true);

    try {
      const res = await fetch('/api/terminal/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();

      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: data.stdout || `Executed: ${cmd}`,
          exitCode: data.exitCode || 0,
          timestamp: new Date().toLocaleTimeString([], { hour12: false })
        }
      ]);
    } catch (e: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: `Error executing command: ${e.message}`,
          exitCode: 1,
          timestamp: new Date().toLocaleTimeString([], { hour12: false })
        }
      ]);
    } finally {
      setIsExecuting(false);
      setInputCommand('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <TerminalIcon className="w-5 h-5 text-cyan-400" />
              DevMind Sandbox Interactive CLI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct terminal access to the containerized monorepo toolchain (Cargo, Go, Docker, DevMind CLI)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded hover:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Console
            </button>
          </div>
        </div>

        {/* Quick Command Pills */}
        <div className="pt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-mono mr-1">Quick Presets:</span>
          {QUICK_COMMANDS.map((qCmd, idx) => (
            <button
              key={idx}
              onClick={() => handleExecute(qCmd)}
              disabled={isExecuting}
              className="px-2.5 py-1 text-[11px] font-mono bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 rounded transition-colors whitespace-nowrap"
            >
              $ {qCmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Display Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[580px]">
        {/* Terminal Title Bar */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <span className="ml-2 text-slate-400 font-semibold">devmind-sandbox: /workspace (cgroups v2)</span>
          </div>
          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Landlock Jail Active
          </span>
        </div>

        {/* Output Area */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-4">
          <div className="text-slate-500 leading-relaxed">
            DevMind AI Container Sandbox CLI [Version 1.4.0-linux-x86_64]<br />
            Type <span className="text-cyan-400">help</span>, <span className="text-cyan-400">cargo check</span>, <span className="text-cyan-400">go test</span>, or click any quick preset above.
          </div>

          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <span className="text-slate-600 select-none">[{item.timestamp}]</span>
                <span className="text-slate-500">devmind@sandbox:~$</span>
                <span className="text-slate-100">{item.command}</span>
              </div>
              <pre className="text-slate-300 bg-slate-900/40 p-3 rounded border border-slate-900 whitespace-pre-wrap leading-relaxed">
                {item.output}
              </pre>
            </div>
          ))}

          {isExecuting && (
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="animate-spin text-sm">⠋</span>
              <span>Executing process in isolated container...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Interactive Command Input Box */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 font-mono text-xs">
          <span className="text-cyan-400 font-semibold select-none">devmind@sandbox:~$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command (e.g. cargo check, git status, go test)..."
            disabled={isExecuting}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none"
          />
          <button
            onClick={() => handleExecute()}
            disabled={isExecuting || !inputCommand.trim()}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded transition-colors text-xs font-sans font-semibold flex items-center gap-1"
          >
            Run
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
