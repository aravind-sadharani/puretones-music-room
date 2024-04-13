export default async (request,context) => {
    const url = new URL(request.url)
    url.pathname = "/embed/"
    const queryParameters = new URLSearchParams(url.searchParams)
    const appname = queryParameters.get('appname')
    const title = queryParameters.get('title')
    const oembedJSONLink = `<${url.origin}/discover/?format=json&url=${encodeURIComponent(`${url}`)}>; rel="alternate"; type="application/json+oembed"; title="${title} - ${appname}"`
    const oembedXMLLink = `<${url.origin}/discover/?format=xml&url=${encodeURIComponent(`${url}`)}>; rel="alternate"; type="text/xml+oembed"; title="${title} - ${appname}"`

    const response = await context.next()
    response.headers.append("Link",oembedJSONLink)
    response.headers.append("Link",oembedXMLLink)
    return response
}

export const config = { path: "/player/"}