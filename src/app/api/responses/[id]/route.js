export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        const response = await fetch(`${process.env.BASE_URL}/case/responses/${id}`, {
            method: 'DELETE',
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
