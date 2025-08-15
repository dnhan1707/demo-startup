export async function fetchCases() {
    try {
        const response = await fetch('/api/cases', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.result;
        }
        return [];
    } catch {
        return [];
    }
}

export async function fetchCaseFiles(caseId) {
    try {
        const response = await fetch(`/api/cases/${caseId}`, {
            cache: 'no-store',
            headers: { 
                'Cache-Control': 'no-cache'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.files || [];
        }
        return [];
    } catch {
        return [];
    }
}

export async function saveCase({ case_id, case_name, manual_input, inputs }) {
    const formData = new FormData();
    formData.append('case_id', case_id || '');
    formData.append('case_name', case_name || '');
    formData.append('manual_input', manual_input || '');
    inputs.forEach((input) => {
        if (input.type === 'upload' && input.value && input.value.length > 0) {
            input.value.forEach(file => {
                if (file.type === "application/pdf") {
                    formData.append('files', file);
                }
            });
        }
    });
    const response = await fetch('/api/cases/save', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to save case');
    return data;
}

export async function submitCase({ case_id, case_name, manual_input, inputs }) {
    const formData = new FormData();
    formData.append('case_id', case_id || '');
    formData.append('case_name', case_name || '');
    formData.append('manual_input', manual_input || '');
    inputs.forEach((input) => {
        if (input.type === 'upload' && input.value && input.value.length > 0) {
            input.value.forEach(file => {
                if (file.type === "application/pdf") {
                    formData.append('files', file);
                }
            });
        }
    });
    const response = await fetch('/api/cases/submit', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    return data;
}

export async function fetchResponse(formData) {
    try {
        const response = await fetch('/api/model', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data.result;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function sendEmail(infor) {
    try {
        const response = await fetch('/api/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(infor)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function bulkSubmitCases(ids) {
    const response = await fetch('/api/cases/submit/bulk', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    });
    if (!response.ok) throw new Error('Bulk submit failed');
    return await response.json();
}

export async function deleteCases(caseIds) {
    const response = await fetch('/api/cases/', {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(caseIds)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete case');
    return data;
}

export async function updateCaseName(case_id, case_name) {
    const formData = new FormData();
    formData.append('case_id', case_id);
    formData.append('case_name', case_name);
    const response = await fetch('/api/cases/', {
        method: 'PUT',
        body: formData
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to update case');
    return data;
}

export async function fetchLatestResponse(caseId) {
    const response = await fetch(`/api/cases/${caseId}/latest-response`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch latest response');
    return data.response;
}

export async function submitBulkCasesV2(caseIds) {
    const resp = await fetch('/api/cases/v2/submit/bulk', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ case_ids: caseIds })
    });
    if (resp.status !== 202) {
        let msg = `Unexpected status ${resp.status}`;
        try { const j = await resp.json(); if (j?.error) msg = j.error; } catch {}
        throw new Error(msg);
    }
    const data = await resp.json();
    return data?.accepted || [];
}

export async function fetchTasksStatus(taskIds) {
    const resp = await fetch('/api/cases/tasks/status', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task_ids: taskIds })
    });
    if (!resp.ok) throw new Error(`Status poll failed ${resp.status}`);
    const data = await resp.json();
    return data?.results || [];
}

export async function fetchTaskById(taskId) {
    const resp = await fetch(`/api/cases/tasks/${taskId}`);
    if (!resp.ok) throw new Error(`Task fetch failed ${resp.status}`);
    return await resp.json();
}

// New: batch task status polling
// export async function fetchTasksStatus(taskIds) {
//     const resp = await fetch(`${base_url}/case/tasks/status`, {
//         method: 'POST',
//         headers: { 
//             'Content-Type': 'application/json',
//             "x-api-key": api_key
//         },
//         body: JSON.stringify({ task_ids: taskIds })
//     });
//     if (!resp.ok) throw new Error(`Status poll failed ${resp.status}`);
//     const data = await resp.json();
//     return data?.results || [];
// }

// Optional: get single task by id
// export async function fetchTaskById(taskId) {
//     const resp = await fetch(`${base_url}/case/tasks/${taskId}`, {
//         headers: {
//             "x-api-key": api_key
//         }
//     });
//     if (!resp.ok) throw new Error(`Task fetch failed ${resp.status}`);
//     return await resp.json();
// }

