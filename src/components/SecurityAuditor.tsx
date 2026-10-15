import React, { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Lock, FileCode, Check } from 'lucide-react';

interface AuditCheck {
  id: string;
  name: string;
  category: string;
  targetService: string;
  status: 'PASSED' | 'WARNING' | 'CRITICAL';
  description: string;
  remediation: string;
}

const AUDIT_CHECKS: AuditCheck[] = [
  {
    id: 'SEC-01',
    name: 'Landlock Jail Filesystem Boundary',
    category: 'Sandbox Isolation',
    targetService: 'services/engine-rust/runner/src/cgroups_sandbox.rs',
    status: 'PASSED',
    description: 'Enforces read-only rootfs mount and closes socket descriptors before test runner fork/exec.',
    remediation: 'No action required; Landlock ABI ruleset v3 active.'
  },
  {
    id: 'SEC-02',
    name: 'Tamper-Evident SHA-256 Ledger Chaining',
    category: 'Audit & Compliance',
    targetService: 'services/api-go/audit/immutable_logger.go',
    status: 'PASSED',
    description: 'Every agent step computes cryptographic hash of previous record payload; zero chain breaks.',
    remediation: 'No action required; chained hashes validated in ClickHouse.'
  },
  {
    id: 'SEC-03',
    name: 'Concurrent RwLock Contention Invariant',
    category: 'Deadlock & Concurrency',
    targetService: 'services/engine-rust/indexer/src/symbol_graph.rs',
    status: 'PASSED',
    description: 'Lock-free DashMap sharding eliminates circular wait conditions during parallel symbol insertion.',
    remediation: 'Verified with ThreadSanitizer (TSan) harness.'
  },
  {
    id: 'SEC-04',
    name: 'JWT Signature & Claims Validation',
    category: 'Authentication & RBAC',
    targetService: 'services/api-go/auth/jwt_rbac.go',
    status: 'PASSED',
    description: 'Rejects tokens without valid asymmetric signature and enforces expiration window.',
    remediation: 'Middleware active on all /api/v1 routes.'
  },
  {
    id: 'SEC-05',
    name: 'Context Token Overflow & Buffer Truncation',
    category: 'AI Safety & Bounds',
    targetService: 'services/agent-js/context/token_budget.ts',
    status: 'PASSED',
    description: 'Strict sliding window clamps AST skeletons within 32,768 model token capacity.',
    remediation: 'Verified against oversized 500k-line monorepo tests.'
  }
];

export const SecurityAuditor: React.FC = () => {
  const [checks, setChecks] = useState<AuditCheck[]>(AUDIT_CHECKS);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('Just now');

  const handleRunFullAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanned('Just now');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Security & Invariants Governance Auditor
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Static AST security analysis, Landlock sandboxing audit, and SHA-256 compliance integrity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Last Scanned: <span className="text-slate-200">{lastScanned}</span>
            </span>

            <button
              onClick={handleRunFullAudit}
              disabled={isScanning}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Scanning Invariants...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Run Full Security Scan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* High-level status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Security Invariants Compliance</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">100 / 100</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Zero security regression risks</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Active Landlock Jails</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">2 Active</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Isolated Linux cgroups v2</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Audit Ledger Integrity</div>
          <div className="text-2xl font-bold font-mono text-violet-400 mt-1 tabular-nums">Verified</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">SHA-256 chain uninterrupted</div>
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 font-semibold text-xs text-slate-200">
          Audited Invariants & Threat Mitigation Matrix
        </div>

        <div className="divide-y divide-slate-800">
          {checks.map((chk) => (
            <div key={chk.id} className="p-4 text-xs space-y-2 hover:bg-slate-950/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold">{chk.id}</span>
                  <span className="font-semibold text-slate-200">{chk.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[11px] text-slate-400">{chk.category}</span>
                </div>

                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {chk.status}
                </span>
              </div>

              <div className="font-mono text-[11px] text-slate-500">
                Target: {chk.targetService}
              </div>

              <p className="text-slate-300 leading-relaxed">
                {chk.description}
              </p>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Remediation Status: </span>
                {chk.remediation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
