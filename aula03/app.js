import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = [10, 20, 30, 40, 50]

const el = d3.select("ul").selectAll("li")
    .data(data)
    .join(
        enter => enter.append('li')
            .style('color', 'purple')
        ,
        update => update.style('color', 'green'),
        exit => exit.style('color', 'red').remove()
    )
    .text(d => "Hello World - " + d)
    


console.log(el)