import React, { useState } from 'react';
import { Network, Play, RefreshCw, Send, CheckCircle2, Shield, Server, Terminal, Lock } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  service: string;
  description: string;
  sampleBody?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/tasks',
    service: 'services/api-go/tasks',
    description: 'Dispatch an autonomous task to the agent pool with audit telemetry',
    sampleBody: JSON.stringify({
      title: 'Fix AST query parsing bug in tree_sitter_ast.rs',
      project_id: 'prj_devmind_core',
      branch: 'feature/agent-optimization',
      priority: 'P1'
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/api/v1/workspaces',
    service: 'services/api-go/workspaces',
    description: 'List active container sandbox environments and resource utilization',
  },
  {
    method: 'GET',
    path: '/api/health',
    service: 'services/api-go/gateway',
    description: 'Cluster health check and microservice connection status',
  },
  {
    method: 'POST',
    path: '/api/v1/projects/sync',
    service: 'services/api-go/projects',
    description: 'Synchronize git bare repository and fetch latest branch commits',
    sampleBody: JSON.stringify({
      project_id: 'prj_devmind_core',
      branch: 'main',
      force_fetch: true
    }, null, 2)
  }
];

export const GoApiGateway: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(ENDPOINTS[0].sampleBody || '');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.sampleBody || '');
    setResponseData(null);
    setResponseStatus(null);
    setResponseTimeMs(null);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer devmind_jwt_token_sample_lead'
        },
        body: selectedEndpoint.method === 'POST' ? requestBody : undefined
      });

      const elapsed = Math.round(performance.now() - start);
      setResponseTimeMs(elapsed);
      setResponseStatus(res.status);

      const json = await res.json();
      setResponseData(json);
    } catch (e: any) {
      setResponseStatus(500);
      setResponseData({ error: e.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              Distributed API Gateway: services/api-go
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              High-concurrency Go HTTP/2 & gRPC gateway with JWT RBAC, workspace isolation, and SHA-256 audit logging
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Gorilla Mux Active (:8080)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector & Request/Response Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 font-semibold text-xs text-slate-200">
            Available Gateway Endpoints
          </div>

          <div className="divide-y divide-slate-800/60 p-1.5 space-y-0.5">
            {ENDPOINTS.map((ep, idx) => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-md transition-colors text-xs space-y-1 ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      ep.method === 'POST' ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-semibold text-slate-200">{ep.path}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{ep.description}</div>
                  <div className="text-[10px] font-mono text-slate-500">{ep.service}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Request & Response Console */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col space-y-4 p-5">
          {/* Action Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded font-bold ${
                selectedEndpoint.method === 'POST' ? 'text-cyan-400 bg-cyan-950 border border-cyan-800' : 'text-emerald-400 bg-emerald-950 border border-emerald-800'
              }`}>
                {selectedEndpoint.method}
              </span>
              <span className="font-semibold text-slate-200">{selectedEndpoint.path}</span>
            </div>

            <button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Request
                </>
              )}
            </button>
          </div>

          {/* Request Body (for POST) */}
          {selectedEndpoint.method === 'POST' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                JSON Request Payload:
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={5}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-200 focus:outline-none focus:border-emerald-500/80 resize-none transition-colors"
              />
            </div>
          )}

          {/* Response Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Server Response Payload:
              </span>
              {responseStatus !== null && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    HTTP {responseStatus}
                  </span>
                  <span className="text-slate-500 tabular-nums">{responseTimeMs}ms</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-md p-3.5 max-h-72 overflow-y-auto">
              {responseData ? (
                <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center font-mono">
                  Click "Send Request" to invoke the endpoint against the live Go backend gateway.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
