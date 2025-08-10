import { Edit, Trash2, Save, X, Play, PlayCircle, Loader2, Clock, CheckCircle2, XCircle, RotateCw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { submitBulkCasesV2, fetchTasksStatus, fetchLatestResponse } from '../../service/fetchFunctions';

export default function CaseList({
  cases, selectedCase, editingCaseId, editCaseName, isCreating, newCaseName,
  setEditCaseName, setEditingCaseId, setIsCreating, setNewCaseName,
  handleCaseSelect, handleEditCase, handleSaveEditCase, handleDeleteCase, handleCreateCase,
  casesLoading, refreshCases,
  selectedCaseIds = [], onCaseCheckbox = () => {},
  editLoading = false,
  onCaseResult = () => {} // optional: notify parent when a case result is ready
}) {
  // Bulk task map: case_id -> { task_id, state, meta, error, ready, resultFetched }
  const [tasks, setTasks] = useState({});
  const pollingRef = useRef(null);

  const terminalStates = new Set(['SUCCESS', 'FAILURE']);
  const hasActiveTasks = useMemo(
    () => Object.values(tasks).some(t => t && !terminalStates.has(t.state)),
    [tasks]
  );

  const submitBulk = async (caseIds) => {
    if (!Array.isArray(caseIds) || caseIds.length === 0) return;
    try {
      const accepted = await submitBulkCasesV2(caseIds);
      setTasks(prev => {
        const next = { ...prev };
        for (const { case_id, task_id } of accepted) {
          next[case_id] = { task_id, state: 'PENDING', meta: null, error: null, ready: false, resultFetched: false };
        }
        return next;
      });
    } catch (e) {
      console.error('Bulk submit failed', e);
      // Optionally surface a toast/UI
    }
  };

  const retryCase = async (caseId) => submitBulk([caseId]);

  const pollTasks = async () => {
    const active = Object.entries(tasks)
      .filter(([, t]) => t && !terminalStates.has(t.state))
      .map(([, t]) => t.task_id);
    if (active.length === 0) return;
    try {
      const results = await fetchTasksStatus(active);
      const byTaskId = Object.fromEntries(results.map(r => [r.id, r]));
      setTasks(prev => {
        const next = { ...prev };
        for (const [caseId, t] of Object.entries(prev)) {
          if (!t || terminalStates.has(t.state)) continue;
          const upd = byTaskId[t.task_id];
          if (!upd) continue;
          next[caseId] = {
            ...t,
            state: upd.state || t.state,
            meta: upd.meta ?? t.meta,
            error: upd.error ?? null,
            ready: !!upd.ready
          };
        }
        return next;
      });
      // Fetch latest response for newly successful cases
      for (const [caseId, t] of Object.entries(tasks)) {
        const upd = t && byTaskId[t.task_id];
        if (upd && upd.state === 'SUCCESS' && !t.resultFetched) {
          try {
            const json = await fetchLatestResponse(caseId);
            onCaseResult(caseId, json);
            setTasks(prev => ({ ...prev, [caseId]: { ...prev[caseId], resultFetched: true } }));
          } catch {
            // ignore hydration failure; status chip still shows Done
          }
        }
      }
    } catch (e) {
      console.error('Polling error', e);
    }
  };

  // Start/stop polling
  useEffect(() => {
    if (hasActiveTasks && !pollingRef.current) {
      pollingRef.current = setInterval(pollTasks, 3000);
    }
    if (!hasActiveTasks && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [hasActiveTasks, tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  const runSelected = () => submitBulk(selectedCaseIds);
  const runAll = () => submitBulk(cases.map(c => c.id));
  const clearFinished = () => {
    setTasks(prev => {
      const next = {};
      for (const [cid, t] of Object.entries(prev)) {
        if (t && !terminalStates.has(t.state)) next[cid] = t; // keep active only
      }
      return next;
    });
  };

  const renderStatusChip = (t) => {
    if (!t) return null;
    const base = 'px-2 py-0.5 rounded-sm border text-[10px] inline-flex items-center gap-1';
    if (t.state === 'PENDING') {
      return (
        <span className={`${base} bg-yellow-900/40 text-yellow-300 border-yellow-700`}>
          <Clock className="h-3 w-3" /> Queued
        </span>
      );
    }
    if (t.state === 'STARTED' || t.state === 'PROGRESS') {
      return (
        <span className={`${base} bg-blue-900/40 text-blue-300 border-blue-700`}>
          <Loader2 className="h-3 w-3 animate-spin" /> Running{t?.meta?.step ? `: ${t.meta.step}` : ''}
        </span>
      );
    }
    if (t.state === 'SUCCESS') {
      return (
        <span className={`${base} bg-green-900/40 text-green-300 border-green-700`}>
          <CheckCircle2 className="h-3 w-3" /> Done
        </span>
      );
    }
    if (t.state === 'FAILURE') {
      return (
        <span className={`${base} bg-red-900/40 text-red-300 border-red-700`}>
          <XCircle className="h-3 w-3" /> Failed
        </span>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              SELECT OR CREATE CASE
          </h2>
          <div className="flex items-center space-x-2">
            {casesLoading && (
              <span className="flex items-center text-xs text-blue-400">
                <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </span>
            )}
            {Object.keys(tasks).length > 0 && (
              <button
                onClick={clearFinished}
                className="text-xs text-gray-400 hover:underline disabled:opacity-50"
                disabled={hasActiveTasks === false && Object.values(tasks).every(t => !t)}
                title="Clear finished statuses"
              >
                Clear
              </button>
            )}
            <div className='mr-1'></div>
            <button
              onClick={refreshCases}
              className="text-xs text-blue-400 hover:underline"
              disabled={casesLoading}
            >
              Refresh
            </button>
            <div className='mr-1'></div>
            <button
              onClick={() => setIsCreating(true)}
              className="text-xs text-blue-400 hover:underline"
              disabled={hasActiveTasks}
            >
              New Case
            </button>
          </div>
        </div>

        {/* Bulk activity banner */}
        {hasActiveTasks && (
          <div className="px-4 py-2 border-b border-gray-800 bg-black/40 text-xs text-gray-300 flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin text-blue-300" />
            Executing cases... You can monitor progress below.
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((caseData) => {
              const t = tasks[caseData.id];
              const isBusy = t && !terminalStates.has(t.state);
              return (
                <div key={caseData.id} className="border border-gray-700 rounded-sm p-4 flex flex-col space-y-2 bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCaseIds.includes(caseData.id)}
                        onChange={() => onCaseCheckbox(caseData.id)}
                        className="accent-blue-500"
                        disabled={isBusy}
                      />
                      <span className="text-xs text-gray-400">Select</span>
                    </div>
                    <div>
                      {renderStatusChip(t)}
                    </div>
                  </div>
                  {editingCaseId === caseData.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editCaseName}
                        onChange={e => setEditCaseName(e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-white px-2 py-1 rounded-sm flex-1"
                      />
                      <button
                        onClick={() => handleSaveEditCase(caseData.id)}
                        className="text-green-400"
                        disabled={editLoading}
                      >
                        {editLoading ? <span className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full inline-block" /> : <Save className="h-4 w-4" />}
                      </button>
                      <button onClick={() => setEditingCaseId(null)} className="text-gray-400"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => !isBusy && handleCaseSelect(caseData)}
                        className={`text-left flex-1 ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isBusy}
                        title={isBusy ? 'Execution in progress' : 'Open case'}
                      >
                        <h3 className="text-sm font-medium text-white mb-1">{caseData.case_name}</h3>
                        <p className="text-xs text-gray-400">{caseData.description}</p>
                        {t?.state === 'FAILURE' && t?.error && (
                          <p className="text-[10px] text-red-300 mt-1 truncate">Error: {t.error}</p>
                        )}
                      </button>
                      <div className="flex items-center space-x-2 ml-2">
                        {t?.state === 'FAILURE' && (
                          <button
                            onClick={() => retryCase(caseData.id)}
                            className="text-yellow-300 hover:text-yellow-200"
                            title="Retry"
                          >
                            <RotateCw className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleEditCase(caseData.id, caseData.case_name)} className="text-yellow-400" disabled={isBusy}><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteCase(caseData.id)} className="text-red-400" disabled={isBusy}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {isCreating && (
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={newCaseName}
                onChange={e => setNewCaseName(e.target.value)}
                placeholder="Case name"
                className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-sm flex-1"
              />
              <button
                onClick={handleCreateCase}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-sm text-sm text-white"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}