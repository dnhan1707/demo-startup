const base_url = process.env.NEXT_PUBLIC_BASE_URL


export async function fetchCases() {
    try {
        const response = await fetch(`${base_url}/case`);
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
        const response = await fetch(`${base_url}/case/${caseId}`);
        if (response.ok) {
            const data = await response.json();
            return data.files;
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
    const response = await fetch(`${base_url}/case/save`, {
        method: 'POST',
        body: formData,
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
    const response = await fetch(`${base_url}/case/submit`, {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    return data;
}


export async function fetchResponse(formData) {
    try {
        const response = await fetch(`${base_url}/model`, {
            method: 'POST',
            body: formData 
        });

        if (response.ok) {
            const data = await response.json();
            return data.result; // Extract the result field
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
        const response = await fetch(`${base_url}/email`, {
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
    const response = await fetch(`${base_url}/case/submit/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
    });
    if (!response.ok) throw new Error('Bulk submit failed');
    return await response.json();
}

export async function deleteCases(caseIds) {
    const response = await fetch(`${base_url}/case/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${base_url}/case/`, {
        method: 'PUT',
        body: formData
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to update case');
    return data;
}

export async function fetchLatestResponse(caseId) {
    const response = await fetch(`${base_url}/case/${caseId}/latest-response`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch latest response');
    return data.response;
}

