export async function POST(request) {
    try {
        const formData = await request.formData();
        
        const response = await fetch(`${process.env.BASE_URL}/case/save`, {
            method: 'POST',
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
