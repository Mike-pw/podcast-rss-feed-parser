export function Parse(text) {

    const data = new window.DOMParser().parseFromString(text, "text/xml")
    const channel = Array.from(data.querySelectorAll("channel"))
    const image = Array.from(data.querySelectorAll("image"))
    const items = Array.from(data.querySelectorAll("item"))

    const title = channel[0].querySelector("title").innerHTML
    const url = channel[0].getElementsByTagName("link")[0].innerHTML
    const img = getImage(channel, image)
    const description = removeCDATA(channel[0].querySelector("description").innerHTML)

    let episodes = []

    items.forEach(element => {
        let episode
        try {
            episode = {
                url: element.querySelector("enclosure").getAttribute("url"),
                title: element.querySelector("title").innerHTML
            }
        } catch { }
        episodes.push(episode)
    })

    //return object with podcast data and episode list
    return ({
        title: title,
        url: url,
        img: img,
        description: description,
        episodes: episodes
    })

}

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
