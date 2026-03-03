/*
*    main.js
*/

var margin = { left: 100, right: 10, top: 10, bottom: 150};

var width = 600;
var height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/buildings.json").then((data) => {
    data.forEach((d) => {
        d.height = +d.height;
    });

    console.log(data);
    
    var x = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.height)])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(data.map((d) => d.name))
        .range(d3.schemeSet3);

    // x Axis
    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
            .attr("x", -5)
            .attr("y", 10)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")

    // y Axis
    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat((d) => d + "m")
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall)

    // x Labels
    g.append("text")
        .attr("x", width/2 - 25)
        .attr("y", height + 130)
        .attr("text-anchor", "middle")
        .text("Buildings of the world")

    // y Labels
    g.append("text")
        .attr("x", -(height/2))
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height (m)")

    var rectangles = g.selectAll("rect")
        .data(data);

    rectangles.enter()
        .append("rect")
            .attr("x", (d) => x(d.name))
            .attr("y", (d) => y(d.height))
            .attr("width", (d) => x.bandwidth())
            .attr("height", (d) => height - y(d.height))
            .attr("fill", (d) => color(d.name));

            
}).catch((error) => {
    console.log(error);
});