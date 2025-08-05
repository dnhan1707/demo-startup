const base_url = process.env("BASE_URL")

async function fetchResponse(input) {
    const responses = await fetch(`${base_url}/`, {
        body: JSON.stringify(input),
        headers: "applica"
    })
}