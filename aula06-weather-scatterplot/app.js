// import log from "/log.js"

async function draw() {
    // Data
    const dataset =  await d3.json("data.json")

    const xAccessor = d => d.currently.humidity
    const yAccessor = d => d.currently.apparentTemperature

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
    dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // Draw Image
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    // G = Group / Container - Coordinate 0,0
    // Doesn't support x and y
    const ctr = svg.append("g")
        .attr("transform",
            `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)
    
    const tooltip = d3.select('#tooltip')

    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        // .range([0, dimensions.ctrWidth])
        .rangeRound([0, dimensions.ctrWidth])
        .clamp(true)
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        // .range([0, dimensions.ctrHeight])
        .rangeRound([dimensions.ctrHeight, 0])
        .nice()
        .clamp(true)

    // Draw Circles
    ctr.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 4)
        .attr('fill', 'red')
        .attr('data-temp', yAccessor)
        .on('mouseover', function(event, datum) {
            d3.select(this)
                .attr('fill', 'green')
                .attr('r', 8)
            
            tooltip.style('display', 'block')
                .style('top', yScale(yAccessor(datum)) - 25 + "px")
                .style('left', xScale(xAccessor(datum)) + "px")
        })
        .on('mouseleave', function(event) {
            d3.select(this)
                .attr('fill', 'red')
                .attr('r', 5)

            tooltip.style('display', 'none')
        })

    // Axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => d * 100 + '%')
        // .tickValues([0.4, 0.5, 0.8])

    const xAxisGroup = ctr.append('g')
        .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
        .call(xAxis)
        // .style('transform', `translateY(${dimensions.ctrHeight}px)`)
        .classed('axis', true)
        
    xAxisGroup.append('text')
        .attr('x', dimensions.ctrWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .attr('fill', 'black')
        .text('Humidity')

    const yAxis = d3.axisLeft(yScale)

    const yAxisGroup = ctr.append('g')
        .call(yAxis)
        .classed('axis', true)

    yAxisGroup.append('text')
        .attr('x', -dimensions.ctrHeight / 2)
        .attr('y', -dimensions.margin.left + 15)
        .attr('fill', 'black')
        .html('Temperature &deg; F')
        .style('transform', 'rotate(270deg)')

}

draw()