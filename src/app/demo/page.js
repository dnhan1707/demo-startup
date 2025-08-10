'use client'

import { useState, useEffect } from 'react';
import { fetchCases, bulkSubmitCases, deleteCases, updateCaseName } from '../service/fetchFunctions';
import CaseList from './components/CaseList';
import { useRouter } from 'next/navigation';
import { useState as useReactState } from 'react';

export default function DemoPage() {
  const [cases, setCases] = useState([]);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [editCaseName, setEditCaseName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [casesLoading, setCasesLoading] = useState(false);
  const [redirecting, setRedirecting] = useReactState(false);
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, caseId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const router = useRouter();

  const refreshCases = async () => {
    setCasesLoading(true);
    try {
      const data = await fetchCases();
      setCases(data || []);
    } catch {
      setCases([]);
    }
    setCasesLoading(false);
  };

  useEffect(() => {
    refreshCases();
  }, []);

  // CRUD: Create new case (local only, for demo)
  const handleCreateCase = async () => {
    if (!newCaseName.trim()) return;
    // Generate a temp id for the new case
    const tempId = `temp_${Date.now()}`;
    setIsCreating(false);
    setNewCaseName('');
    setRedirecting(true);
    setTimeout(() => {
      router.push(`/demo/${tempId}?name=${encodeURIComponent(newCaseName)}`);
    }, 400);
  };

  // CRUD: Edit case (local only, for demo)
  const handleEditCase = (caseId, title) => {
    setEditingCaseId(caseId);
    setEditCaseName(title);
  };

  const handleSaveEditCase = async (caseId) => {
    setEditLoading(true);
    try {
      await updateCaseName(caseId, editCaseName);
      setEditingCaseId(null);
      setEditCaseName('');
      await refreshCases();
    } catch (e) {
      alert('Failed to update case');
    }
    setEditLoading(false);
  };

  // CRUD: Delete case (local only, for demo)
  const handleDeleteCase = (caseId) => {
    setDeleteModal({ open: true, caseId });
  };

  const confirmDeleteCase = async () => {
    setDeleteLoading(true);
    try {
      await deleteCases([deleteModal.caseId]);
      setDeleteModal({ open: false, caseId: null });
      await refreshCases();
    } catch (e) {
      alert('Failed to delete case');
      setDeleteModal({ open: false, caseId: null });
    }
    setDeleteLoading(false);
  };

  const handleCaseSelect = (caseData) => {
    setRedirecting(true);
    setTimeout(() => {
      router.push(`/demo/${caseData.id}`);
    }, 400); // short delay for UX, can be adjusted or removed
  };

  // Checkbox toggle
  const handleCaseCheckbox = (caseId) => {
    setSelectedCaseIds(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  // Run all cases
  const handleRunAll = async () => {
    setBulkLoading(true);
    setBulkResult(null);
    try {
      const ids = cases.map(c => c.id);
      await bulkSubmitCases(ids);
      setBulkResult('done');
      setTimeout(() => setBulkResult(null), 2000);
    } catch (e) {
      setBulkResult('Bulk run failed');
      setTimeout(() => setBulkResult(null), 2000);
    }
    setBulkLoading(false);
  };

  // Run selected cases
  const handleRunSelected = async () => {
    if (selectedCaseIds.length === 0) return;
    setBulkLoading(true);
    setBulkResult(null);
    try {
      await bulkSubmitCases(selectedCaseIds);
      setBulkResult('done');
      setTimeout(() => setBulkResult(null), 2000);
    } catch (e) {
      setBulkResult('Bulk run failed');
      setTimeout(() => setBulkResult(null), 2000);
    }
    setBulkLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Delete confirmation modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181A20] border border-gray-700 shadow-2xl rounded-lg w-full max-w-sm p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-700 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse" />
              <h2 className="text-base font-semibold text-gray-100 tracking-wide">Delete Case</h2>
            </div>
            <div className="px-6 py-5">
              <p className="mb-4 text-gray-300 text-sm">
                Are you sure you want to delete this case?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition"
                  onClick={() => setDeleteModal({ open: false, caseId: null })}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-gradient-to-r from-red-800 to-red-600 text-white font-semibold border border-red-900 hover:from-red-700 hover:to-red-500 transition"
                  onClick={confirmDeleteCase}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Loading overlay when redirecting or bulk running */}
      {(redirecting || bulkLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-lg text-blue-200 font-semibold">
              {redirecting ? "Loading case..." : "Running cases..."}
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
              SELECT CASE
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Bulk run controls */}
        {/* <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunAll}
            className="flex items-center gap-2 bg-[#23262E] hover:bg-[#2B2E39] border border-[#2B2E39] shadow-sm px-5 py-2 rounded transition-all text-sm font-semibold text-blue-200 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={cases.length === 0 || bulkLoading}
          >
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Run All Cases
          </button>
          <button
            onClick={handleRunSelected}
            className="flex items-center gap-2 bg-[#1B2B23] hover:bg-[#22342A] border border-[#22342A] shadow-sm px-5 py-2 rounded transition-all text-sm font-semibold text-green-200 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={selectedCaseIds.length === 0 || bulkLoading}
          >
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Run Selected Cases
          </button>
          {bulkResult && (
            <span className="text-xs text-yellow-300 ml-2">
              {bulkResult === 'done' ? 'Bulk run finished.' : bulkResult}
            </span>
          )}
        </div> */}
        <CaseList
          cases={cases}
          selectedCase={null}
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
          casesLoading={casesLoading}
          refreshCases={refreshCases}
          selectedCaseIds={selectedCaseIds}
          onCaseCheckbox={handleCaseCheckbox}
          editLoading={editLoading}
        />
      </div>
    </div>
  );
}