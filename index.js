export function Parser(text) {

    let html = ``

    const data = new window.DOMParser().parseFromString(text, "text/xml")
    const channel = Array.from(data.querySelectorAll("channel"))
    const image = Array.from(data.querySelectorAll("image"))
    const items = Array.from(data.querySelectorAll("item"))

    html += `<h2>
            ${channel[0].querySelector("title").innerHTML}
        </h2>
        <a href="${channel[0].getElementsByTagName("link")[0].innerHTML}">
        <img src="${getImage(channel, image)}" width="300px"/>
        </a>
        <p>
        ${removeCDATA(channel[0].querySelector("description").innerHTML)}
        </p>
`
    items.forEach(element => {
        try {
            url = element.querySelector("enclosure").getAttribute("url")
            html += `
                  <h3>
                  <a
                  href="#" onclick='selectEpisode("${url}")'>
                      ${element.querySelector("title").innerHTML}
                    </a>
                  </h3>`
        }
        catch { }

    })

    return html

    //get image from feed, first try to find <image> element with child <url>, if error then look for <image> with href attribute. 
    function getImage(channel, image) {
        try { return image[0].querySelector("url").innerHTML }
        catch { return channel[0].querySelector("image").getAttribute("href") }
    }

    //clean RSS feed of CDATA
    function removeCDATA(string) {

        if (string.includes("<![CDATA[")) {
            string = string.replace("<![CDATA[", "")
            string = string.replace("]]>", "")
            return string
        } else return string

    }

}