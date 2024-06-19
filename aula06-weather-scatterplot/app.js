import log from "/log.js"

async function draw() {
    // Data
    const dataset =  await d3.json("data.json")
    // log(dataset)

    // Dimensions
    let dimensions = {
        width: 800,
        height: 800,
        margin: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    }

    // Draw Image
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    // G = Group / Container - Coordinate 0,0
    // Doesn't support x and y
    const ctr = svg.append("g")
        // .style("fill", "red")
        .attr("transform",
            `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)

    ctr.append("circle")
        .attr("r", 15)
        .style("fill", "green")
}

draw()