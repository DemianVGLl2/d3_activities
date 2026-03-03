/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

d3.csv("data/ages.csv").then((data) => {
    console.log(data);
});

d3.tsv("data/ages.tsv").then((data) => {
    console.log(data);
});

d3.json("data/ages.json").then((data) => {
    data.forEach((d) => {
        d.age = +d.age;
    });
    console.log(data);

    var circles = svg.selectAll("circle")
        .data(data);

    circles.enter()
        .append("circle")
            .attr("cx", (d, i) => { return (i * 50) + 25; })
            .attr("cy", 100)
            .attr("r", (d) => { return d.age * 2; })
            .attr("fill", (d) => d.age > 10 ? "red" : "blue");
}).catch((error) => {
    console.log(error);
});