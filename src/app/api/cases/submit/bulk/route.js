export async function POST(request) {
    try {
        const ids = await request.json();
        
        const response = await fetch(`${process.env.BASE_URL}/case/submit/bulk`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            },
            body: JSON.stringify(ids)
        });
        
        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
