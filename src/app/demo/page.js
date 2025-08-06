'use client'

import { useState, useEffect } from 'react';
import { fetchResponse } from '../service/fetchFunctions';
import CaseList from './components/CaseList';
import CaseInputPanel from './components/CaseInputPanel';
import ResultPanel from './components/ResultPanel';

export default function DemoPage() {
  // In-memory cases
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [inputs, setInputs] = useState([{ type: null, value: null }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [editCaseName, setEditCaseName] = useState('');

  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cases`);
        const data = await res.json();
        setCases(data.cases || []);
      } catch {
        setCases([]);
      }
    }
    fetchCases();
  }, []);

  // CRUD: Create new case
  const handleCreateCase = async () => {
    if (!newCaseName.trim()) return;
    const newCase = {
      id: `case_${Date.now()}`,
      title: newCaseName,
      description: '',
      defaultInputs: [{ type: null, value: null }]
    };
    setCases(prev => [...prev, newCase]);
    setSelectedCase(newCase);
    setInputs(newCase.defaultInputs);
    setNewCaseName('');
    setIsCreating(false);
    // Optionally send to backend here
    // await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cases`, { method: 'POST', body: JSON.stringify(newCase), headers: { 'Content-Type': 'application/json' } });
  };

  // CRUD: Edit case
  const handleEditCase = (caseId, title) => {
    setEditingCaseId(caseId);
    setEditCaseName(title);
  };
  const handleSaveEditCase = (caseId) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, title: editCaseName } : c));
    setEditingCaseId(null);
    setEditCaseName('');
    // Optionally send to backend here
  };

  // CRUD: Delete case
  const handleDeleteCase = (caseId) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
    if (selectedCase?.id === caseId) {
      setSelectedCase(null);
      setInputs([{ type: null, value: null }]);
      setResult(null);
    }
    // Optionally send to backend here
  };

  const handleCaseSelect = (caseData) => {
    setSelectedCase(caseData);
    setInputs(caseData.defaultInputs || [{ type: null, value: null }]);
    setResult(null);
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
    setSelectedCase(null);
    setInputs([{ type: null, value: null }]);
    setResult(null);
  };

  // Only allow PDF
  const buildApiPayload = () => {
    const formData = new FormData();
    formData.append('case_id', selectedCase?.id || 'custom');
    formData.append('case_type', selectedCase?.title || 'Custom Case');
    let hasFiles = false;
    inputs.forEach((input) => {
      if (input.type === 'upload' && input.value && input.value.length > 0) {
        input.value.forEach(file => {
          if (file.type === "application/pdf") {
            formData.append('files', file);
            hasFiles = true;
          }
        });
      }
    });
    return formData;
  };

  const submitDemo = async () => {
    setLoading(true);
    setResult(null);
    const apiPayload = buildApiPayload();
    try {
      const apiResult = await fetchResponse(apiPayload);
      // Parse the stringified JSON in apiResult if needed
      let parsedResult = apiResult;
      if (apiResult && typeof apiResult.result === 'string') {
        try {
          parsedResult = JSON.parse(apiResult.result);
        } catch {
          parsedResult = { error: 'Failed to parse result' };
        }
      } else if (apiResult && typeof apiResult.result === 'object') {
        parsedResult = apiResult.result;
      }
      setResult(parsedResult);
      // console.log("Parsed: ", parsedResult);
    } catch (error) {
      console.error('API call failed:', error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <h1 className="text-xl font-medium">CLAIMS DECISION ENGINE</h1>
            </div>
            <div className="text-sm text-gray-400">
              {selectedCase ? `CASE: ${selectedCase.title.toUpperCase()}` : 'SELECT CASE'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedCase && (
          <CaseList
            cases={cases}
            selectedCase={selectedCase}
            editingCaseId={editingCaseId}
            editCaseName={editCaseName}
            isCreating={isCreating}
            newCaseName={newCaseName}
            setEditCaseName={setEditCaseName}
            setEditingCaseId={setEditingCaseId}
            setIsCreating={setIsCreating}
            setNewCaseName={setNewCaseName}
            handleCaseSelect={handleCaseSelect}
            handleEditCase={handleEditCase}
            handleSaveEditCase={handleSaveEditCase}
            handleDeleteCase={handleDeleteCase}
            handleCreateCase={handleCreateCase}
          />
        )}

        {selectedCase && (
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
            />
            <ResultPanel loading={loading} result={result} />
          </div>
        )}
      </div>
    </div>
  );
}