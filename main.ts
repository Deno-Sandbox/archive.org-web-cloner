import { serve, Response } from `https://deno.land/std@0.104.0/http/server.ts`;
import { readerFromStreamReader } from `https://deno.land/std/io/mod.ts`;
const server = serve({ port: 6955 });


const WEBSITEURL = `http://www.exemple.com/`
const CLEANURL = WEBSITEURL.replace('//', '')
const PROXYURL = "${PROXYURL}/"    // the public url of this proxy
const FIRSTID = `20191125222569` // time stamp in URL


async function main(request) {
    try {
        let response: Response = {}

        //console.log(request.url)

        let token = request.url.split(`/`)[1]

        if (request.url == `/`) {
            token = FIRSTID
        }

        let baseWebsite = `https://web.archive.org/web/${token}/${WEBSITEURL}`
        let tmp = await fetch(baseWebsite + request.url.replace(`/`+token, ``))
        console.log(baseWebsite + request.url.replace(`/`+token, ``))

        if (request.url.endsWith('.js') || request.url.endsWith('.css') || request.url.endsWith('.html') || request.url == `/`) {
            response.body = await tmp.text()

            response.body = filter(response.body, token)
            let token_List = getAllToken(response.body)
            for(let i = 0; i < token_List.length; i++){
                if(token_List[i] != token){
                    response.body = filter(response.body, token_List[i])
                }
            }

        } else {
            try {
                const rdr = tmp.body?.getReader();
                if (rdr) {
                    const r = readerFromStreamReader(rdr);
                    const f = await Deno.open('./tmp', {
                        create: true,
                        write: true
                    });
                    await Deno.copy(r, f);
                    f.close();
                    response.body = Deno.readFileSync('./tmp');
                } else {
                    response.status = 418
                }
            } catch (err) {
                response.status = 418
            }
        }

        try {

            if (request.url == `/` || request.url.endsWith('.html')) {
                //delete the header
                response.body = response.body.split('<-- BEGIN WAYBACK TOOLBAR INSERT -->')[0] + response.body.split('<-- END WAYBACK TOOLBAR INSERT -->')[1] + response.body.split('</html>')[0] + '</html>'
            }
        } catch (err) {}



        request.respond(response)
    } catch (err) {
        request.respond({
            body: `Error`,
            status: 404
        })
    }
}

function filter(html, token) {


    let baseWebsite = `https://web.archive.org/web/${token}/${WEBSITEURL}`
    let baseWebsiteIMG = `https://web.archive.org/web/${token}/${WEBSITEURL}`
    let baseWebsiteJS = `https://web.archive.org/web/${token}/${WEBSITEURL}`

    let baseWebsite2 = `/web/${token}/${WEBSITEURL}`
    let baseWebsiteIMG2 = `/web/${token}/${WEBSITEURL}`
    let baseWebsiteJS2 = `/web/${token}/${WEBSITEURL}`

    let baseWebsite3 = `/web/${token}/${CLEANURL}`
    let baseWebsiteIMG3 = `/web/${token}/${CLEANURL}`
    let baseWebsiteJS3 = `/web/${token}/${CLEANURL}`


    while (html.includes(baseWebsite)) {
        html = html.replace(baseWebsite, `${PROXYURL}/${token}/`)
    }
    while (html.includes(baseWebsiteIMG)) {
        html = html.replace(baseWebsiteIMG, `${PROXYURL}/${token}/`)
    }
    while (html.includes(baseWebsiteJS)) {
        html = html.replace(baseWebsiteJS, `${PROXYURL}/${token}/`)
    }

    while (html.includes(baseWebsite2)) {
        html = html.replace(baseWebsite2, `${PROXYURL}/${token}/`)
    }
    while (html.includes(baseWebsiteIMG2)) {
        html = html.replace(baseWebsiteIMG2, `${PROXYURL}/${token}/`)
    }
    while (html.includes(baseWebsiteJS2)) {
        html = html.replace(baseWebsiteJS2, `${PROXYURL}/${token}/`)
    }

    while (html.includes(baseWebsite3)) {
        html = html.replace(baseWebsite3, `${PROXYURL}/${token}/`)
    }
    while (html.includes(baseWebsiteIMG3)) {
        html = html.replace(baseWebsiteIMG3, `${PROXYURL}/${token}/`)
    }
    while (html.includes(baseWebsiteJS3)) {
        html = html.replace(baseWebsiteJS3, `${PROXYURL}/${token}/`)
    }

    return html
}

function getAllToken(html) {
    let token = []

    let data = html.split('/web/')
    for (let i = 1; i < data.length; i++) {
        let tmp = data[i].split('/')[0]
        if (token.indexOf(tmp) == -1) {
            token.push(tmp)
        }
    }

    console.log(token)
    return token
}







for await (const request of server) {
    if ([`GET`, `POST`].includes(request.method)) {
        main(request)
    } else {
        request.respond({
            status: 418
        })
    }
}
