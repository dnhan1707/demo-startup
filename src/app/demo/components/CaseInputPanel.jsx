import { FileText, X, Upload, ChevronRight } from 'lucide-react';

export default function CaseInputPanel({
  selectedCase, inputs, handleTypeSelect, handleFileChange, addInput, removeInput, resetAll, submitDemo, loading
}) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
            DATA INPUTS - {selectedCase.title.toUpperCase()}
          </h2>
          <button
            onClick={resetAll}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
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
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={submitDemo}
          disabled={loading}
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