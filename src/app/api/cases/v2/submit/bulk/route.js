export async function POST(request) {
    try {
        const body = await request.json();
        
        const resp = await fetch(`${process.env.BASE_URL}/case/v2/submit/bulk`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            },
            body: JSON.stringify(body)
        });
        
        const data = await resp.json();
        return Response.json(data, { status: resp.status });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
