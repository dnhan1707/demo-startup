export async function POST(request) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${process.env.BASE_URL}/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
