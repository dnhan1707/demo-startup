export async function GET(request, { params }) {
    try {
        const { id } = params;
        const response = await fetch(`${process.env.BASE_URL}/case/${id}/latest-response`, {
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
