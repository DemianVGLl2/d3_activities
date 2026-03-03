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

d3.json("data/revenues.json").then((data) => {
    data.forEach((d) => {
        d.revenue = +d.revenue;
    });

    console.log(data);
    
    var x = d3.scaleBand()
        .domain(data.map((d) => d.month))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.revenue)])
        .range([height, 0]);

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
    
    g.select(".x.axis")
        .select(".domain")
        .attr("stroke", "white");

    g.select(".x.axis")
        .selectAll(".tick line")
        .attr("stroke", "white");

    g.select(".x.axis")
        .selectAll(".tick text")
        .attr("stroke", "white")
        .style("font-size", "10px")
        .style("font-weight", "100");
    
    // y Axis
    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat((d) => "$" + d)
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall)

    g.select(".y.axis")
        .select(".domain")
        .attr("stroke", "white");

    g.select(".y.axis")
        .selectAll(".tick line")
        .attr("stroke", "white");

    g.select(".y.axis")
        .selectAll(".tick text")
        .attr("stroke", "white")
        .style("font-size", "10px")
        .style("font-weight", "100");

    // x Labels
    g.append("text")
        .attr("x", width/2)
        .attr("y", height + 80)
        .attr("text-anchor", "middle")
        .text("Month")
        .style("fill", "white")
        .style("font-size", "24px")
        .style("font-weight", "bold")

    // y Labels
    g.append("text")
        .attr("x", -(height/2))
        .attr("y", -80)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Revenue (dlls.)")
        .style("fill", "white")
        .style("font-size", "24px")
        .style("font-weight", "bold")

    var rectangles = g.selectAll("rect")
        .data(data);

    rectangles.enter()
        .append("rect")
            .attr("x", (d) => x(d.month))
            .attr("y", (d) => y(d.revenue))
            .attr("width", (d) => x.bandwidth())
            .attr("height", (d) => height - y(d.revenue))
            .attr("fill", "yellow");

            
}).catch((error) => {
    console.log(error);
});