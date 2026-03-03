/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 1000)
    .attr("height", 900);

d3.json("data/buildings.json").then((data) => {
    data.forEach((d) => {
        d.height = +d.height;
    });
    console.log(data);

    var rectangles = svg.selectAll("rect")
        .data(data);

    rectangles.enter()
        .append("rect")
            .attr("x", (d, i) => { return (i * 100) + 25; })
            .attr("y", (d) => 900 - d.height)
            .attr("width", 40)
            .attr("height", (d) => d.height)
            .attr("fill", "gray");
            
}).catch((error) => {
    console.log(error);
});