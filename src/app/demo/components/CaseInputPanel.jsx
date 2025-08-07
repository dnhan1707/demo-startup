'use client'

import { FileText, X, Upload, ChevronRight, FileDown, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';

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
  saveDisabled = false
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

  const groupedFiles = useMemo(() => groupFilesByDate(caseFiles || []), [caseFiles]);


  return (
    <div className="lg:col-span-2 space-y-6">
      {/* --- File History Section --- */}
      <div className="border border-gray-800 bg-gray-900/20 rounded-sm mb-4">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Case File History</h3>
          {historyLoading && (
            <span className="flex items-center text-xs text-blue-400">
              <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
              Loading...
            </span>
          )}
          <button
            onClick={refreshHistory}
            className="text-xs text-blue-400 hover:underline ml-2"
            disabled={historyLoading}
          >
            Refresh
          </button>
        </div>
        <div className="p-4 space-y-4">
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
                        // Format as "YYYY-MM-DD HH:00"
                        const date = dateHour.slice(0, 4) + '-' + dateHour.slice(4, 6) + '-' + dateHour.slice(6, 8);
                        const hour = dateHour.slice(9, 11);
                        return `Date: ${date} ${hour}:00`;
                      })()
                  }
                </div>
                {files.map(f => (
                  <div key={f.filename} className="flex items-center space-x-2 text-xs mb-1">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span>{f.filename}</span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center">
                      <Eye className="h-4 w-4" /> View
                    </a>
                    <a href={f.url} download className="text-green-400 hover:underline flex items-center">
                      <FileDown className="h-4 w-4" /> Download
                    </a>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

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
        />
      </div>

      {/* --- PDF Upload UI --- */}
      <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
            DATA INPUTS - {selectedCase.case_name.toUpperCase()}
          </h2>
          {onSaveCase && (
            <button
              onClick={onSaveCase}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-sm text-white font-medium"
              disabled={loading || saveDisabled}
            >
              Save Case
            </button>
          )}
          <button
            onClick={onRequestChangeCase}
            className="border border-gray-700 hover:border-gray-600 px-6 py-3 rounded-sm transition-colors text-sm"
          >
            CHANGE CASE
          </button>
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
                        onChange={(e) => handleFileChange(index, Array.from(e.target.files).filter(f => f.type === "application/pdf"))}
                        className="hidden"
                        id={`file-${index}`}
                      />
                      <label htmlFor={`file-${index}`} className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Drop files or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PDF only</p>
                      </label>
                    </div>
                    {input.value && input.value.length > 0 && (
                      <div className="space-y-1">
                        {input.value.map((file, i) => (
                          <div key={i} className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-sm">
                            <span><FileText className="h-4 w-4 text-blue-400" /></span>
                            <span>{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
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

      {/* --- Action Buttons --- */}
      <div className="flex space-x-4">
        <button
          onClick={() => submitDemo({ manualInput })}
          disabled={loading || !canSubmit}
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
        >
          RESET
        </button>
      </div>
    </div>
  );
}