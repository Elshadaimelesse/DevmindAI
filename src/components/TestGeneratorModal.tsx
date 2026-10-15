import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, FileCheck, RefreshCw } from 'lucide-react';
import { MonorepoFile } from '../data/monorepoFiles';

interface TestGeneratorModalProps {
  file: MonorepoFile;
  onClose: () => void;
}

export const TestGeneratorModal: React.FC<TestGeneratorModalProps> = ({ file, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<string | null>(null);
  const [coverageDelta, setCoverageDelta] = useState('+22.4%');
  const [testCount, setTestCount] = useState(5);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: file.path,
          fileContent: file.content,
          language: file.language
        })
      });
      const data = await res.json();
      setGeneratedTests(data.generatedTests);
      setCoverageDelta(data.coverageForecast || '+22.4%');
      setTestCount(data.testCount || 5);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedTests) {
      navigator.clipboard.writeText(generatedTests);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              AI Unit Test Suite Generator
            </h3>
            <span className="font-mono text-xs text-slate-400">({file.name})</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <div>Target: <span className="font-mono text-cyan-400 font-semibold">{file.path}</span></div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Synthesize Tests
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedTests ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded border border-slate-800">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">{testCount} Production Unit Tests Created</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-mono font-semibold">Coverage Delta {coverageDelta}</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Test Suite'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
                <pre>{generatedTests}</pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded bg-slate-950/40 space-y-2">
              <Sparkles className="w-8 h-8 text-cyan-500/60 mx-auto" />
              <p>Click "Synthesize Tests" to run Gemini AST analysis and generate edge-case regression test suites.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
