export default async (request,context) => {
    const url = new URL(request.url)
    url.pathname = "/embed/"
    const oembedJSONLink = `${url.origin}/oembed/?format=json&url=${encodeURIComponent(`${url}`)}`
    const oembedXMLLink = `${url.origin}/oembed/?format=xml&url=${encodeURIComponent(`${url}`)}`

    const response = await context.next()
    response.headers.append("Link",oembedJSONLink)
    response.headers.append("Link",oembedXMLLink)
    return response
}

export const config = { path: "/player/"}