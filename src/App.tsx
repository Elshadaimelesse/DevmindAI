import React, { useState } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { AgentStudio } from './components/AgentStudio';
import { SwarmWarRoom } from './components/SwarmWarRoom';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { MonorepoExplorer } from './components/MonorepoExplorer';
import { RustEngineConsole } from './components/RustEngineConsole';
import { GoApiGateway } from './components/GoApiGateway';
import { SecurityAuditor } from './components/SecurityAuditor';
import { ClusterTelemetry } from './components/ClusterTelemetry';
import { EvalBenchmarkSuite } from './components/EvalBenchmarkSuite';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { MonorepoFile } from './data/monorepoFiles';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('studio');

  const handleDispatchFileToAgent = (file: MonorepoFile) => {
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Contract (3 zones, single line) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewTaskClick={() => setActiveTab('studio')}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 pb-12">
        {activeTab === 'studio' && <AgentStudio />}
        {activeTab === 'swarm' && <SwarmWarRoom />}
        {activeTab === 'terminal' && <InteractiveTerminal />}
        {activeTab === 'monorepo' && (
          <MonorepoExplorer onDispatchToAgent={handleDispatchFileToAgent} />
        )}
        {activeTab === 'rust-engine' && <RustEngineConsole />}
        {activeTab === 'go-api' && <GoApiGateway />}
        {activeTab === 'security' && <SecurityAuditor />}
        {activeTab === 'telemetry' && <ClusterTelemetry />}
        {activeTab === 'evals' && <EvalBenchmarkSuite />}
        {activeTab === 'architecture' && <ArchitectureVisualizer />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">DevMind AI Platform</span>
          <span>·</span>
          <span>Version 1.4.0</span>
          <span>·</span>
          <span>SWE-bench Verified</span>
          <span>·</span>
          <span>Landlock Sandbox</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-500">
          <button onClick={() => setActiveTab('swarm')} className="hover:text-slate-300 transition-colors">
            Swarm War Room
          </button>
          <span>·</span>
          <button onClick={() => setActiveTab('terminal')} className="hover:text-slate-300 transition-colors">
            Sandbox CLI
          </button>
          <span>·</span>
          <button onClick={() => setActiveTab('security')} className="hover:text-slate-300 transition-colors">
            Security Auditor
          </button>
          <span>·</span>
          <button onClick={() => setActiveTab('telemetry')} className="hover:text-slate-300 transition-colors">
            Telemetry
          </button>
          <span>·</span>
          <button onClick={() => setActiveTab('architecture')} className="hover:text-slate-300 transition-colors">
            Architecture Specs
          </button>
        </div>
      </footer>
    </div>
  );
}
