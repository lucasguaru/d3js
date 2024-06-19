import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// const pBrowser = document.querySelectorAll('p')
const body = d3.select('body')
const p = body.append('p')

p.attr("name", "fred")
    .style("color", "red")

log(body, "body")


