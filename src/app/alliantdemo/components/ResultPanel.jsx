import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function ResultPanel({ loading, result, onFetchLatest, recentLoading }) {
    
    if (result && typeof result === 'string') {
        try {
            result = JSON.parse(result);
        } catch {
            result = {};
        }
    }

    return (
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
            {/* <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">QUEUE</span>
                <span className="text-gray-300">0 PENDING</span>
            </div> */}
            </div>
        </div>

        {/* Recent Analysis Fetch Trigger */}
        {!loading && !result && (
            <div className="border border-gray-800 bg-gray-900/20 rounded-sm">
                <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/40">
                    <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                        RECENT ANALYSIS
                    </h3>
                </div>
                <div className="p-4">
                    <button
                        onClick={onFetchLatest}
                        disabled={recentLoading}
                        className="text-sm px-4 py-2 rounded-sm bg-[#23262E] border border-[#2B2E39] hover:bg-[#2B2E39] disabled:opacity-60"
                    >
                        {recentLoading ? 'Fetching...' : 'See the recent analysis'}
                    </button>
                </div>
            </div>
        )}

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
                {result.decision === 'APPROVED' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                ) : result.decision === 'REVIEW_REQUIRED' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                ) : (
                    <X className="h-5 w-5 text-red-400" />
                )}
                <span className={`text-lg font-medium ${
                    result.decision === 'APPROVED' ? 'text-green-400' :
                    result.decision === 'REVIEW_REQUIRED' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                    {result.decision}
                </span>
                </div>
                <div className="space-y-3 text-sm">
                <div>
                    <span className="text-gray-400 uppercase tracking-wider">CONFIDENCE</span>
                    <div className="mt-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                            result.confidence >= 90 ? 'bg-green-400' :
                            result.confidence >= 75 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${result.confidence}%` }}
                        />
                    </div>
                    <span className={`font-mono ${
                        result.confidence >= 90 ? 'text-green-400' :
                        result.confidence >= 75 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                        {result.confidence}%
                    </span>
                    </div>
                </div>
                <div>
                    <span className="text-gray-400 uppercase tracking-wider">RISK ASSESSMENT</span>
                    <div className={`mt-1 ${
                    result.riskScore === 'LOW' ? 'text-green-400' :
                    result.riskScore === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {result.riskScore}
                    </div>
                </div>
                {/* <div>
                    <span className="text-gray-400 uppercase tracking-wider">PROCESSING TIME</span>
                    <div className="mt-1 text-gray-300">{result.processingTime}</div>
                </div> */}
                {result.flags && (
                    <div>
                    <span className="text-gray-400 uppercase tracking-wider">FLAGS</span>
                    <div className="mt-1 space-y-1">
                        {result.flags.map((flag, i) => (
                        <span key={i} className="inline-block text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded mr-1">
                            {flag}
                        </span>
                        ))}
                    </div>
                    </div>
                )}
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
    );
}