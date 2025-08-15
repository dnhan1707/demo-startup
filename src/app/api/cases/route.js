export async function GET() {
    try {
        const response = await fetch(`${process.env.BASE_URL}/case`, {
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return Response.json({ result: data.result });
        }
        return Response.json({ result: [] });
    } catch {
        return Response.json({ result: [] });
    }
}

export async function DELETE(request) {
    try {
        const caseIds = await request.json();
        
        const response = await fetch(`${process.env.BASE_URL}/case/`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            },
            body: JSON.stringify(caseIds)
        });
        
        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const formData = await request.formData();
        
        const response = await fetch(`${process.env.BASE_URL}/case/`, {
            method: 'PUT',
            body: formData,
            headers: {
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            }
        });
        
        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}