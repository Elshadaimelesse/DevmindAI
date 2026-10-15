import React, { useState, useMemo } from 'react';
import { 
  FolderTree, FileText, Search, Copy, Check, ChevronRight, ChevronDown, 
  Terminal, Sparkles, Code2, Server, Cpu, Database, Shield, BookOpen, Plus, Edit3, Save, RotateCcw, ShieldCheck
} from 'lucide-react';
import { MONOREPO_FILES, MonorepoFile } from '../data/monorepoFiles';
import { TestGeneratorModal } from './TestGeneratorModal';

interface MonorepoExplorerProps {
  onDispatchToAgent?: (file: MonorepoFile) => void;
}

export const MonorepoExplorer: React.FC<MonorepoExplorerProps> = ({ onDispatchToAgent }) => {
  const [files, setFiles] = useState<MonorepoFile[]>(MONOREPO_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<MonorepoFile>(MONOREPO_FILES[0]);
  const [copied, setCopied] = useState(false);
  
  // File edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(MONOREPO_FILES[0].content);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New file modal
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileLang, setNewFileLang] = useState<'typescript' | 'rust' | 'go' | 'json' | 'sql' | 'yaml'>('typescript');

  // Test generator modal
  const [testGenFile, setTestGenFile] = useState<MonorepoFile | null>(null);

  // Filter files
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = 
        file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'agent') return file.path.includes('services/agent-js');
      if (selectedCategory === 'go') return file.path.includes('services/api-go');
      if (selectedCategory === 'rust') return file.path.includes('services/engine-rust');
      if (selectedCategory === 'infra') return file.path.includes('infrastructure') || file.path.includes('docker-compose');
      if (selectedCategory === 'datasets') return file.path.includes('datasets');
      if (selectedCategory === 'packages') return file.path.includes('packages');
      if (selectedCategory === 'docs') return file.path.includes('docs') || file.name === 'README.md';

      return true;
    });
  }, [files, searchQuery, selectedCategory]);

  const handleSelectFile = (file: MonorepoFile) => {
    setSelectedFile(file);
    setEditedContent(file.content);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedContent : selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveChanges = () => {
    setFiles((prev) =>
      prev.map((f) => (f.path === selectedFile.path ? { ...f, content: editedContent } : f))
    );
    setSelectedFile((prev) => ({ ...prev, content: editedContent }));
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateNewFile = () => {
    if (!newFilePath.trim()) return;
    const name = newFilePath.split('/').pop() || newFilePath;
    const newFile: MonorepoFile = {
      path: newFilePath.trim(),
      name,
      directory: newFilePath.includes('/') ? newFilePath.substring(0, newFilePath.lastIndexOf('/')) : 'root',
      language: newFileLang,
      description: 'User created monorepo component',
      size: '0.4 KB',
      content: `// DevMind AI: ${name}\nexport function init() {\n  return true;\n}\n`
    };

    setFiles((prev) => [newFile, ...prev]);
    setSelectedFile(newFile);
    setEditedContent(newFile.content);
    setShowNewFileModal(false);
    setNewFilePath('');
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'rust': return 'text-orange-400 bg-orange-950/40 border-orange-800';
      case 'go': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
      case 'typescript': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800';
      case 'sql': return 'text-amber-400 bg-amber-950/40 border-amber-800';
      case 'json': return 'text-yellow-400 bg-yellow-950/40 border-yellow-800';
      case 'yaml': return 'text-violet-400 bg-violet-950/40 border-violet-800';
      default: return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-400" />
              DevMind AI Monorepo Architecture & Editor
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Interactive file browser, in-line editor, and AI unit test generator for all monorepo tiers
            </p>
          </div>

          {/* Action and Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewFileModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              New File
            </button>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          {[
            { id: 'all', label: 'All Files', count: files.length },
            { id: 'rust', label: 'Engine (Rust)', count: files.filter(f => f.path.includes('services/engine-rust')).length },
            { id: 'agent', label: 'Agent (JS/TS)', count: files.filter(f => f.path.includes('services/agent-js')).length },
            { id: 'go', label: 'Gateway (Go)', count: files.filter(f => f.path.includes('services/api-go')).length },
            { id: 'packages', label: 'Packages & Contracts', count: files.filter(f => f.path.includes('packages')).length },
            { id: 'infra', label: 'Infrastructure & DB', count: files.filter(f => f.path.includes('infrastructure') || f.path.includes('docker-compose')).length },
            { id: 'datasets', label: 'SWE-bench Datasets', count: files.filter(f => f.path.includes('datasets')).length },
            { id: 'docs', label: 'Docs & Specs', count: files.filter(f => f.path.includes('docs') || f.name === 'README.md').length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] text-slate-500 tabular-nums">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: File Sidebar + Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col max-h-[750px]">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Repository Files</span>
            <span className="tabular-nums font-mono text-[11px] text-slate-500">
              {filteredFiles.length} matches
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/60 p-1.5 space-y-0.5">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => handleSelectFile(file)}
                  className={`w-full text-left p-2.5 rounded-md transition-colors text-xs flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-medium truncate text-slate-200">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                      {file.path}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getLanguageColor(file.language)}`}>
                        {file.language}
                      </span>
                      <span className="text-[10px] text-slate-500 tabular-nums">
                        {file.size}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredFiles.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching files found in current filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer / In-line Editor */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
          {/* File Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-mono text-xs font-semibold text-white truncate">
                  {selectedFile.path}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {selectedFile.description}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Generate tests button */}
              <button
                onClick={() => setTestGenFile(selectedFile)}
                className="px-2.5 py-1.5 text-xs font-medium text-purple-300 bg-purple-950/60 border border-purple-800/80 hover:bg-purple-900/60 rounded transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Generate Tests
              </button>

              {/* Edit Mode Toggle */}
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setEditedContent(selectedFile.content);
                      setIsEditing(false);
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 rounded transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save File
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit File
                </button>
              )}

              {/* Copy Code */}
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Feedback banner if saved */}
          {savedSuccess && (
            <div className="bg-emerald-950/80 border-b border-emerald-800 px-4 py-2 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              File changes successfully saved to virtual workspace.
            </div>
          )}

          {/* Code Viewer / Interactive Editor */}
          {isEditing ? (
            <div className="p-4 bg-slate-950">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={22}
                className="w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded p-4 text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              />
            </div>
          ) : (
            <div className="p-4 bg-slate-950 overflow-x-auto max-h-[660px]">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <code>
                  {selectedFile.content.split('\n').map((line, idx) => (
                    <div key={idx} className="flex hover:bg-slate-900/60 px-1 py-0.2 rounded transition-colors">
                      <span className="w-10 shrink-0 text-slate-600 select-none tabular-nums text-right pr-4 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="whitespace-pre flex-1 text-slate-200">
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="px-5 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div>
              <span>Language: </span>
              <span className="text-slate-300 capitalize">{selectedFile.language}</span>
              <span className="mx-2">·</span>
              <span>Lines: </span>
              <span className="text-slate-300 tabular-nums">
                {selectedFile.content.split('\n').length}
              </span>
            </div>
            <div>
              <span>Size: </span>
              <span className="text-slate-300 tabular-nums">{selectedFile.size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Create New Monorepo File</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">File Path relative to root:</label>
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="e.g. services/agent-js/tools/profiler.ts"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Language:</label>
                <select
                  value={newFileLang}
                  onChange={(e: any) => setNewFileLang(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="json">JSON</option>
                  <option value="sql">SQL</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewFile}
                disabled={!newFilePath.trim()}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold rounded transition-colors shadow-sm"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Generator Modal */}
      {testGenFile && (
        <TestGeneratorModal
          file={testGenFile}
          onClose={() => setTestGenFile(null)}
        />
      )}
    </div>
  );
};
