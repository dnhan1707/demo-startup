'use client'

import { FileText, X, Upload, ChevronRight, FileDown, History } from 'lucide-react';
import { useState, useMemo } from 'react';
import { saveCase, deleteFile, deleteResponseFile } from '../../service/fetchFunctions';

function groupFilesByDate(files) {
  const groups = {};
  files.forEach(f => {
    // Extract timestamp after last underscore, before extension
    const match = f.filename.match(/_(\d{8}T\d{6})\./);
    if (match) {
      const dateHour = match[1].slice(0, 11); // e.g., "20250807T13"
      if (!groups[dateHour]) groups[dateHour] = [];
      groups[dateHour].push(f);
    } else {
      if (!groups['Other']) groups['Other'] = [];
      groups['Other'].push(f);
    }
  });
  return groups;
}

export default function CaseInputPanel({
  selectedCase, 
  inputs, 
  handleTypeSelect, 
  handleFileChange, 
  addInput, 
  removeInput, 
  resetAll, 
  submitDemo, 
  loading, 
  caseFiles,
  historyLoading,
  refreshHistory,
  isCaseSaved,
  onSaveCase,
  manualInput,
  setManualInput,
  onRequestChangeCase,
  saveDisabled = false,
  onClearInputs
}) {
  // Separate files by type
  const pdfFiles = useMemo(() => caseFiles?.filter(f => f.type === 'pdf'), [caseFiles]);
  const textFiles = useMemo(() => caseFiles?.filter(f => f.type === 'text'), [caseFiles]);
  const responseFiles = useMemo(() => caseFiles?.filter(f => f.filename.startsWith('response_')), [caseFiles]);

  // Check if there is a previous response
  const hasPreviousResponse = responseFiles && responseFiles.length > 0;

  // Submission enabled if: at least one uploaded file OR manual input OR history exists
  const hasUploadedFiles = inputs.some(
    (input) => input.type === 'upload' && Array.isArray(input.value) && input.value.length > 0
  );
  const canSubmit = hasUploadedFiles || manualInput.trim() || (caseFiles && caseFiles.length > 0);

  // Enable Save only when there are new uploads or manual input
  const canSave = hasUploadedFiles || Boolean(manualInput && manualInput.trim());

  // Local saving state to show overlay and disable UI
  const [saving, setSaving] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);

  const groupedFiles = useMemo(() => groupFilesByDate(caseFiles || []), [caseFiles]);

  // Remove a file from a specific input
  const handleRemoveFile = (inputIdx, fileIdx) => {
    const updated = [...inputs];
    if (Array.isArray(updated[inputIdx].value)) {
      updated[inputIdx].value = updated[inputIdx].value.filter((_, i) => i !== fileIdx);
      handleFileChange(inputIdx, updated[inputIdx].value);
    }
  };

  // Handle multiple file selection - append to existing files
  const handleMultipleFileChange = (inputIdx, newFiles) => {
    const updated = [...inputs];
    const existingFiles = Array.isArray(updated[inputIdx].value) ? updated[inputIdx].value : [];
    const allFiles = [...existingFiles, ...newFiles];
    handleFileChange(inputIdx, allFiles);
  };

  // Disable all input areas while loading/saving
  const inputDisabled = loading || saving;

  // Wrapper to handle save; uses parent if provided, otherwise saves here (with case_id for existing cases)
  const handleSaveClick = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      if (onSaveCase) {
        await onSaveCase();
        // Clear inputs after successful parent save
        onClearInputs?.();
      } else {
        const isTemp = selectedCase?.id?.startsWith?.('temp_');
        await saveCase({
          case_id: isTemp ? '' : selectedCase?.id || '',
          case_name: selectedCase?.case_name,
          manual_input: manualInput,
          inputs
        });
        // Refresh history after saving
        await refreshHistory?.();
        // Clear inputs after local save
        onClearInputs?.();
      }
    } catch (e) {
      // optionally surface error UI
      console.error('Save failed', e);
      alert('Failed to save case');
    } finally {
      setSaving(false);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (file) => {
    if (deletingFileId) return; // Prevent multiple deletes
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${file.filename}"?`);
    if (!confirmDelete) return;
    
    setDeletingFileId(file.id || file.filename);
    try {
      const isResponseFile = file.filename.startsWith('response_');
      
      if (isResponseFile) {
        await deleteResponseFile(file.id || file.filename);
      } else {
        await deleteFile(file.id || file.filename);
      }
      
      // Refresh history after successful deletion
      await refreshHistory?.();
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete file: ${error.message}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-lg text-green-200 font-semibold">Saving case...</div>
          </div>
        </div>
      )}

      {/* --- Warning if solved --- */}
      {hasPreviousResponse && !isCaseSaved && (
        <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 px-4 py-2 rounded mb-2 text-xs">
          This case was solved. Are you sure you want to proceed?
        </div>
      )}

      {/* --- Manual Input --- */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Manual Input (optional):</label>
        <textarea
          className="w-full border border-gray-700 bg-gray-900 text-white rounded px-3 py-2 text-sm"
          rows={3}
          value={manualInput}
          onChange={e => setManualInput(e.target.value)}
          placeholder="Paste or type claim details here..."
          disabled={inputDisabled}
        />
      </div>

      {/* --- PDF Upload UI --- */}
      <div className={`border border-gray-800 bg-gray-900/20 rounded-sm ${inputDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
            DATA INPUTS - {selectedCase.case_name.toUpperCase()}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {inputs.map((input, index) => (
            <div key={index} className="border border-gray-800 bg-black/40 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase">INPUT {index + 1}</span>
                {inputs.length > 1 && (
                  <button
                    onClick={() => removeInput(index)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="p-4">
                {/* Only allow PDF upload */}
                {!input.type && (
                  <div>
                    <button
                      onClick={() => handleTypeSelect(index, 'upload')}
                      className="flex items-center space-x-2 p-3 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 transition-all rounded-sm text-left"
                    >
                      <Upload className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Upload PDF Document</span>
                    </button>
                  </div>
                )}
                {input.type === 'upload' && (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-700 rounded-sm p-6 text-center hover:border-gray-600 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleMultipleFileChange(index, Array.from(e.target.files).filter(f => f.type === "application/pdf"))}
                        className="hidden"
                        id={`file-${index}`}
                      />
                      <label htmlFor={`file-${index}`} className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Drop files or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PDF only - Multiple files supported</p>
                      </label>
                    </div>
                    {input.value && input.value.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400 mb-2">
                          {input.value.length} file(s) selected
                        </div>
                        {input.value.map((file, i) => (
                          <div
                            key={file.name + '_' + i}
                            className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-sm"
                          >
                            <span><FileText className="h-4 w-4 text-blue-400" /></span>
                            <span className="flex-1 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            <button
                              type="button"
                              className="ml-2 text-red-400 hover:text-red-300 flex-shrink-0"
                              onClick={() => handleRemoveFile(index, i)}
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addInput}
            className="w-full border border-dashed border-gray-700 hover:border-gray-600 p-4 rounded-sm text-sm text-gray-400 hover:text-gray-300 transition-all"
          >
            + ADD ADDITIONAL PDF
          </button>
        </div>
      </div>

      {/* --- File History Section --- */}
      <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${historyOpen ? 'rotate-90' : ''}`} />
            </button>
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Case File History</h3>
          </div>
          <div className="flex items-center space-x-2">
            {historyLoading && (
              <span className="flex items-center text-xs text-blue-400">
                <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </span>
            )}
            <button
              onClick={() => refreshHistory()}
              className="text-xs text-blue-400 hover:underline"
              disabled={historyLoading || saving}
            >
              Refresh
            </button>
          </div>
        </div>
        {historyOpen && (
          <div className="p-4 max-h-64 overflow-y-auto space-y-4">
            {historyLoading ? (
              <div className="text-xs text-gray-400">Loading history...</div>
            ) : Object.keys(groupedFiles).length === 0 ? (
              <div className="text-gray-400 text-xs">No files found for this case.</div>
            ) : (
              Object.entries(groupedFiles).map(([dateHour, files]) => (
                <div key={dateHour} className="mb-2">
                  <div className="font-bold text-xs text-blue-300 mb-1">
                    {dateHour === 'Other'
                      ? 'Other Files'
                      : (() => {
                          const date = dateHour.slice(0, 4) + '-' + dateHour.slice(4, 6) + '-' + dateHour.slice(6, 8);
                          const hour = dateHour.slice(9, 11);
                          return `Date: ${date} ${hour}:00`;
                        })()
                    }
                  </div>
                  {files.map((f, idx) => (
                    <div key={f.filename + '_' + idx} className="flex items-center space-x-2 text-xs mb-1 p-2 bg-gray-800/30 rounded">
                      <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate flex-1">{f.filename}</span>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <a href={f.url} download className="text-green-400 hover:text-green-300">
                          <FileDown className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(f)}
                          disabled={deletingFileId === (f.id || f.filename)}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          title="Delete file"
                        >
                          {deletingFileId === (f.id || f.filename) ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex space-x-4">
        <button
          onClick={handleSaveClick}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-6 py-3 rounded-sm transition-colors text-sm font-medium"
          disabled={loading || saving || !canSave}
          title={
            canSave
              ? 'Save current inputs/files'
              : 'Add files or manual input to enable save'
          }
        >
          <span>SAVE CASE</span>
        </button>
        <button
          onClick={() => submitDemo({ manualInput })}
          disabled={loading || saving || !canSubmit}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-sm transition-colors text-sm font-medium"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>PROCESSING</span>
            </>
          ) : (
            <>
              <span>EXECUTE ANALYSIS</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
        <button
          onClick={resetAll}
          className="border border-gray-700 hover:border-gray-600 px-6 py-3 rounded-sm transition-colors text-sm"
          disabled={loading || saving}
        >
          RESET
        </button>
      </div>
    </div>
  );
}