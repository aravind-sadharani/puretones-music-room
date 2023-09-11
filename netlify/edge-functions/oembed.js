export default async (request) => {
    const url = new URL(request.url)
    const embedURL = new URL(url.searchParams.get("url"))
    const format = url.searchParams.get("format")

    const queryParameters = new URLSearchParams(embedURL.searchParams)
    const appname = queryParameters.get('appname')
    const title = queryParameters.get('title')

    if(format === "json") {
        const discoveryParamsJSON = {
            "version": "0.1",
            "type": "rich",
            "provider_name": "Puretones Music",
            "provider_url": "https://puretones.sadharani.com",
            "title": `${title} - ${appname}`,
            "author_name": "Sadharani Music Works",
            "author_url": "https://www.sadharani.com",
            "html": `<iframe src='${embedURL}'></iframe>`
        }
    
        return Response.json(discoveryParamsJSON)
    } else if(format === "xml") {
        const discoveryParamsXML = `<oembed>
    <version>0.1</version>
    <type>rich</type>
    <provider_name>Puretones Music</provider_name>
    <provider_url>https://puretones.sadharani.com</provider_url>
    <title>${title} - ${appname}</title>
    <author_name>Sadharani Music Works</author_name>
    <author_url>https://www.sadharani.com</author_url>
    <html><![CDATA[<iframe src='${embedURL}'></iframe>]]></html>
</oembed>`
        return new Response(discoveryParamsXML)
    }
}

export const config = { path: "/oembed"}