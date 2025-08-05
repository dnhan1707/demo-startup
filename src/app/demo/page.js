'use client'

import { useState } from 'react';
import { ArrowRight, X, Upload, FileText, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function DemoPage() {
  const [inputs, setInputs] = useState([{ type: null, value: null }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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

  const handleManualChange = (index, text) => {
    const updated = [...inputs];
    updated[index].value = text;
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
    setInputs([{ type: null, value: null }]);
    setResult(null);
  };

  const submitDemo = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult({
        decision: 'APPROVED',
        reasoning: 'Analysis indicates valid claim with sufficient documentation and policy compliance verification.',
        confidence: 94.7,
        riskScore: 'LOW',
        processingTime: '1.2s'
      });
      setLoading(false);
    }, 2000);
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
            {/* <div className="text-sm text-gray-400">
              v2.1.0 | {new Date().toLocaleTimeString()}
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40">
                <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  DATA INPUTS
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
                      {!input.type && (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleTypeSelect(index, 'upload')}
                            className="flex items-center space-x-2 p-3 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 transition-all rounded-sm text-left"
                          >
                            <Upload className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Upload Documents</span>
                          </button>
                          <button
                            onClick={() => handleTypeSelect(index, 'manual')}
                            className="flex items-center space-x-2 p-3 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 transition-all rounded-sm text-left"
                          >
                            <FileText className="h-4 w-4 text-green-400" />
                            <span className="text-sm">Manual Entry</span>
                          </button>
                        </div>
                      )}

                      {input.type === 'upload' && (
                        <div className="space-y-3">
                          <div className="border-2 border-dashed border-gray-700 rounded-sm p-6 text-center hover:border-gray-600 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) => handleFileChange(index, Array.from(e.target.files))}
                              className="hidden"
                              id={`file-${index}`}
                            />
                            <label htmlFor={`file-${index}`} className="cursor-pointer">
                              <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">Drop files or click to upload</p>
                              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                            </label>
                          </div>
                          {input.value && input.value.length > 0 && (
                            <div className="space-y-1">
                              {input.value.map((file, i) => (
                                <div key={i} className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-sm">
                                  <FileText className="h-4 w-4 text-blue-400" />
                                  <span>{file.name}</span>
                                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {input.type === 'manual' && (
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400 uppercase tracking-wider">CLAIM DESCRIPTION</label>
                          <textarea
                            className="w-full bg-black border border-gray-700 text-white p-3 rounded-sm resize-none focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                            rows={4}
                            placeholder="Enter claim details, incident description, policy information..."
                            value={input.value}
                            onChange={(e) => handleManualChange(index, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addInput}
                  className="w-full border border-dashed border-gray-700 hover:border-gray-600 p-4 rounded-sm text-sm text-gray-400 hover:text-gray-300 transition-all"
                >
                  + ADD ADDITIONAL INPUT
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

          {/* Results Panel */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                  SYSTEM STATUS
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">ENGINE</span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-400">ONLINE</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">ML MODELS</span>
                  <span className="text-green-400">LOADED</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">QUEUE</span>
                  <span className="text-gray-300">0 PENDING</span>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading && (
              <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40">
                  <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    ANALYSIS IN PROGRESS
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <span>Processing claim data...</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Running fraud detection algorithms...
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40">
                  <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                    DECISION ANALYSIS
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-lg font-medium text-green-400">{result.decision}</span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider">CONFIDENCE</span>
                      <div className="mt-1 flex items-center space-x-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-green-400 font-mono">{result.confidence}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider">RISK ASSESSMENT</span>
                      <div className="mt-1 text-green-400">{result.riskScore}</div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider">PROCESSING TIME</span>
                      <div className="mt-1 text-gray-300">{result.processingTime}</div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider">REASONING</span>
                      <div className="mt-1 text-gray-300 text-xs leading-relaxed">
                        {result.reasoning}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}