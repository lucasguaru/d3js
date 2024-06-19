import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import log from "/log.js"

async function getData() {
    const data = await d3.json('data.json')
    log(data)
}

getData()


