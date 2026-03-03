/*
*    main.js
*/

console.log("Activity: Data Binding - d3 v " + d3.version);

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

var data = [25, 20, 15, 10, 5];

var rectangles = svg.selectAll("rect")
    .data(data);

rectangles.enter()
    .append("rect")
        .attr("x", 200)
        .attr("y", (d, i) => {
            console.log("Item: " + d + " Index: " + i);
            return (i * 50) + 25;
        })
        .attr("width", 40)
        .attr("height", (d) => { return d; })
        .attr("fill", (d, i) => { return "rgb("+ (i*50) + ", 0, 0)"; });