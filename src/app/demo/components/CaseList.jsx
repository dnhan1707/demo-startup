import { Edit, Trash2, Save, X } from 'lucide-react';

export default function CaseList({
  cases, selectedCase, editingCaseId, editCaseName, isCreating, newCaseName,
  setEditCaseName, setEditingCaseId, setIsCreating, setNewCaseName,
  handleCaseSelect, handleEditCase, handleSaveEditCase, handleDeleteCase, handleCreateCase,
  casesLoading, refreshCases,
  selectedCaseIds = [], onCaseCheckbox = () => {},
  editLoading = false
}) {
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
            >
              New Case
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((caseData) => (
              <div key={caseData.id} className="border border-gray-700 rounded-sm p-4 flex flex-col space-y-2 bg-black/30">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCaseIds.includes(caseData.id)}
                    onChange={() => onCaseCheckbox(caseData.id)}
                    className="accent-blue-500"
                  />
                  <span className="text-xs text-gray-400">Select</span>
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
                      onClick={() => handleCaseSelect(caseData)}
                      className="text-left flex-1"
                    >
                      <h3 className="text-sm font-medium text-white mb-1">{caseData.case_name}</h3>
                      <p className="text-xs text-gray-400">{caseData.description}</p>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEditCase(caseData.id, caseData.case_name)} className="text-yellow-400"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteCase(caseData.id)} className="text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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