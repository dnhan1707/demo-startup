export async function GET(request, { params }) {
    try {
        const { id } = params;
        const response = await fetch(`${process.env.BASE_URL}/case/${id}`, {
            cache: 'no-store',
            headers: { 
                'Cache-Control': 'no-cache',
                "x-api-key": process.env.SYNSURE_PUBLIC_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return Response.json({ files: data.files || [] });
        }
        return Response.json({ files: [] });
    } catch {
        return Response.json({ files: [] });
    }
}
