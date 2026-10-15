import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Cpu, CheckCircle2, RefreshCw, Lock, Terminal } from 'lucide-react';

interface AuditLog {
  index: number;
  timestamp: string;
  agent_id: string;
  action_type: string;
  file: string;
  sha256_record: string;
}

export const ClusterTelemetry: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      index: 1042,
      timestamp: new Date().toISOString(),
      agent_id: 'agent-js-orchestrator',
      action_type: 'AST_PATCH_APPLY',
      file: 'services/engine-rust/indexer/src/symbol_graph.rs',
      sha256_record: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      index: 1041,
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      agent_id: 'gemini-2.5-flash-worker',
      action_type: 'DECOMPOSE_GOAL',
      file: 'services/agent-js/planner/react_loop.ts',
      sha256_record: '89d0ac628cfb75199ff246c483a9a117b3d07e600869ebf9eb115f082e6d6fd9'
    },
    {
      index: 1040,
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      agent_id: 'api-go-gateway',
      action_type: 'WORKSPACE_PROVISION',
      file: 'infrastructure/docker/Dockerfile.engine-rust',
      sha256_record: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/audit/logs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Cluster Telemetry & ClickHouse Audit Stream
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live monitoring of container pods, cgroups resource utilization, and append-only cryptographic event logs
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Stream
          </button>
        </div>
      </div>

      {/* Microservice Pods Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'services/engine-rust', role: 'SIMD Code Engine', memory: '124 MB', cpu: '0.8 cores', status: 'Optimal' },
          { name: 'services/agent-js', role: 'Gemini ReAct Runtime', memory: '248 MB', cpu: '0.4 cores', status: 'Optimal' },
          { name: 'services/api-go', role: 'HTTP/2 & gRPC Gateway', memory: '86 MB', cpu: '0.2 cores', status: 'Optimal' },
          { name: 'ClickHouse + Postgres', role: 'Storage & Audit Logs', memory: '412 MB', cpu: '0.5 cores', status: 'Optimal' }
        ].map((pod, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="font-semibold text-white">{pod.name}</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {pod.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">{pod.role}</div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>RAM: <strong className="text-slate-200">{pod.memory}</strong></span>
              <span>CPU: <strong className="text-slate-200">{pod.cpu}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Append-Only Cryptographic Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            ClickHouse devmind_audit.agent_telemetry (Immutable SHA-256 Ledger)
          </div>
          <span className="text-[11px] font-mono text-slate-500">Append-Only / MergeTree</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Index</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Agent ID</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Target File</th>
                <th className="p-3">SHA-256 Payload Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {logs.map((log) => (
                <tr key={log.index} className="hover:bg-slate-950/40">
                  <td className="p-3 text-cyan-400 font-semibold">{log.index}</td>
                  <td className="p-3 text-slate-500 text-[11px] tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                  </td>
                  <td className="p-3 text-slate-200 font-medium">{log.agent_id}</td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] max-w-xs truncate">{log.file}</td>
                  <td className="p-3 text-emerald-400 text-[10px] font-mono max-w-xs truncate">
                    {log.sha256_record}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
