export async function GET(request, { params }) {
    try {
        const { id } = params;
        const resp = await fetch(`${process.env.BASE_URL}/case/tasks/${id}`, {
            headers: {
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            }
        });
        
        const data = await resp.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
