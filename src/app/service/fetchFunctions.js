const base_url = process.env.NEXT_PUBLIC_BASE_URL;

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

