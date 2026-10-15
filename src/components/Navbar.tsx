import React from 'react';
import { 
  Terminal, Cpu, Network, BarChart3, BookOpen, FolderTree, 
  Users, Activity, ShieldCheck 
} from 'lucide-react';

export type TabType = 
  | 'studio' 
  | 'swarm'
  | 'terminal'
  | 'monorepo' 
  | 'rust-engine' 
  | 'go-api' 
  | 'security'
  | 'telemetry' 
  | 'evals' 
  | 'architecture';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onNewTaskClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onNewTaskClick,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand wordmark */}
      <div 
        onClick={() => onSelectTab('studio')}
        className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tighter">
          DM
        </div>
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          DevMind AI
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-400 overflow-x-auto py-1">
        <button
          onClick={() => onSelectTab('studio')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'studio'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          Agent Studio
        </button>

        <button
          onClick={() => onSelectTab('swarm')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'swarm'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-purple-400" />
          Swarm War Room
        </button>

        <button
          onClick={() => onSelectTab('terminal')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'terminal'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          Sandbox CLI
        </button>

        <button
          onClick={() => onSelectTab('monorepo')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'monorepo'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5 text-amber-400" />
          Monorepo & Editor
        </button>

        <button
          onClick={() => onSelectTab('rust-engine')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'rust-engine'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-orange-400" />
          Engine (Rust)
        </button>

        <button
          onClick={() => onSelectTab('go-api')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'go-api'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Network className="w-3.5 h-3.5 text-emerald-400" />
          Gateway (Go)
        </button>

        <button
          onClick={() => onSelectTab('security')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'security'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          Security Auditor
        </button>

        <button
          onClick={() => onSelectTab('telemetry')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'telemetry'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          Cluster Telemetry
        </button>

        <button
          onClick={() => onSelectTab('evals')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'evals'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
          SWE-bench Evals
        </button>

        <button
          onClick={() => onSelectTab('architecture')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'architecture'
              ? 'text-white bg-slate-800/90 font-semibold'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Architecture Docs
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewTaskClick}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
        >
          <Terminal className="w-3.5 h-3.5" />
          Dispatch Agent Task
        </button>
      </div>
    </header>
  );
};
