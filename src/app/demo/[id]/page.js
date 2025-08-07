'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { fetchCases, fetchCaseFiles, saveCase, submitCase } from '../../service/fetchFunctions';
import CaseInputPanel from '../components/CaseInputPanel';
import ResultPanel from '../components/ResultPanel';

export default function CaseDemoPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [inputs, setInputs] = useState([{ type: null, value: null }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [caseFiles, setCaseFiles] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [loadingCase, setLoadingCase] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Only temp case is unsaved
  const isTempCase = id && id.startsWith('temp_');
  const tempCaseName = searchParams?.get('name') || 'New Case';

  useEffect(() => {
    async function loadCases() {
      setLoadingCase(true);
      if (isTempCase) {
        setSelectedCase({
          id,
          case_name: tempCaseName,
          description: '',
          defaultInputs: [{ type: null, value: null }]
        });
        setInputs([{ type: null, value: null }]);
        setLoadingCase(false);
      } else {
        const allCases = await fetchCases();
        setCases(allCases || []);
        const found = (allCases || []).find(c => c.id === id);
        setSelectedCase(found || null);
        setInputs(found?.defaultInputs || [{ type: null, value: null }]);
        setLoadingCase(false);
      }
    }
    loadCases();
  }, [id, isTempCase, tempCaseName]);

  useEffect(() => {
    if (!isTempCase && id) {
      refreshHistory();
    }
  }, [id, isTempCase]);

  const refreshHistory = async () => {
    setHistoryLoading(true);
    try {
      const files = await fetchCaseFiles(id);
      setCaseFiles(files || []);
    } catch {
      setCaseFiles([]);
    }
    setHistoryLoading(false);
  };

  // Save: always use empty case_id for temp/unsaved case
  const handleSaveCase = async () => {
    setSaveDisabled(true);
    try {
      await saveCase({
        case_id: '', // always empty for new case
        case_name: selectedCase?.case_name,
        manual_input: manualInput,
        inputs
      });
      router.push('/demo');
    } catch {
      alert('Failed to save case');
    }
    setSaveDisabled(false);
  };

  const handleTypeSelect = (index, type) => {
    const updated = [...inputs];
    updated[index] = { type, value: type === 'upload' ? [] : '' };
    setInputs(updated);
  };

  const handleFileChange = (index, files) => {
    const updated = [...inputs];
    updated[index].value = [...files];
    setInputs(updated);
  };

  const addInput = () => {
    setInputs([...inputs, { type: null, value: null }]);
  };

  const removeInput = (index) => {
    const updated = [...inputs];
    updated.splice(index, 1);
    setInputs(updated);
  };

  const resetAll = () => {
    router.push('/demo');
  };

  // Submit: disable Save during submit for temp case, after submit Save stays available
  const submitDemo = async ({ manualInput }) => {
    setLoading(true);
    setResult(null);
    if (isTempCase) setSaveDisabled(true);
    try {
      const res = await submitCase({
        case_id: selectedCase?.id,
        case_name: selectedCase?.case_name,
        manual_input: manualInput,
        inputs
      });
      setResult(res.result || res);
      if (!isTempCase) refreshHistory();
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
      if (isTempCase) setSaveDisabled(false);
    }
  };

  // Change case handler for unsaved temp case
  const handleRequestChangeCase = () => {
    if (isTempCase) {
      setShowUnsavedModal(true);
    } else {
      resetAll();
    }
  };

  if (loadingCase) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-lg text-blue-200 font-semibold">Loading case...</div>
        </div>
      </div>
    );
  }

  if (!selectedCase) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-lg">Case not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Unsaved modal for temp case */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181A20] border border-gray-700 shadow-2xl rounded-lg w-full max-w-sm p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-700 flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              <h2 className="text-base font-semibold text-gray-100 tracking-wide">Unsaved Case</h2>
            </div>
            <div className="px-6 py-5">
              <p className="mb-4 text-gray-300 text-sm">
                This case is not saved. Are you sure you want to leave?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    resetAll();
                  }}
                >
                  Leave Without Saving
                </button>
                <button
                  className="px-4 py-2 rounded bg-gradient-to-r from-blue-800 to-blue-600 text-white font-semibold border border-blue-900 hover:from-blue-700 hover:to-blue-500 transition"
                  onClick={async () => {
                    await handleSaveCase();
                    setShowUnsavedModal(false);
                  }}
                  disabled={saveDisabled}
                >
                  Save & Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <h1 className="text-xl font-medium">CLAIMS DECISION ENGINE</h1>
            </div>
            <div className="text-sm text-gray-400">
              {selectedCase ? `CASE: ${selectedCase.case_name?.toUpperCase()}` : ''}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CaseInputPanel
            selectedCase={selectedCase}
            inputs={inputs}
            handleTypeSelect={handleTypeSelect}
            handleFileChange={handleFileChange}
            addInput={addInput}
            removeInput={removeInput}
            resetAll={resetAll}
            submitDemo={submitDemo}
            loading={loading}
            caseFiles={caseFiles}
            historyLoading={historyLoading}
            refreshHistory={refreshHistory}
            isCaseSaved={!isTempCase}
            onSaveCase={isTempCase ? handleSaveCase : undefined}
            manualInput={manualInput}
            setManualInput={setManualInput}
            onRequestChangeCase={handleRequestChangeCase}
            saveDisabled={saveDisabled}
          />
          <ResultPanel loading={loading} result={result} />
        </div>
      </div>
    </div>
  );
}
