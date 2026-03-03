/*
*    main.js
*/

console.log("Activity: D3 Fundamentals - d3 v " + d3.version);

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

var circle = svg.append("circle")
    .attr("cx", 400)
    .attr("cy", 250)
    .attr("r", 60)
    .attr("fill", "aquamarine");

var rect = svg.append("rect")
    .attr("x", 100)
    .attr("y", 20)
    .attr("width", 200)
    .attr("height", 20)
    .attr("fill", "violet");