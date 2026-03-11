/*
*    main.js
*/

var margin = { left: 100, right: 10, top: 10, bottom: 150};

var width = 600;
var height = 400;

var flag = true;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand().range([0, width]).padding(0.2);
var y = d3.scaleLinear().range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

g.append("text")
    .attr("x", width/2)
    .attr("y", height + 130)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Month")

var yLabel = g.append("text")
    .attr("x", -(height/2))
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Revenue (dlls.)")

d3.json("data/revenues.json").then((data) => {
    data.forEach((d) => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    d3.interval(() => {
        var newData = flag ? data : data.slice(1);
        update(data);
        flag = !flag;
    }, 1000);

    update(data);
            
}).catch((error) => {
    console.log(error);
});

function update(data) {
    var value = flag ? "revenue" : "profit";
    var label = flag ? "Revenue (dlls.)" : "Profit (dlls.)";

    // update domains
    x.domain(data.map((d) => d.month));
    y.domain([0, d3.max(data, (d) => d[value])]);

    // update axis
    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall)
        .selectAll(".tick text")
        .attr("fill", "white")
        .style("font-size", "12px");

    xAxisGroup.selectAll(".domain, .tick line").attr("stroke", "white");

    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat((d) => "$" + d);

    yAxisGroup.transition(t).call(yAxisCall)
        .selectAll(".tick text")
        .attr("fill", "white")
        .style("font-size", "12px");

    yAxisGroup.selectAll(".domain, .tick line").attr("stroke", "white");

    // update label y
    yLabel.text(label);

    // DATA JOIN
    var barrs = g.selectAll("rect").data(data, (d) => d.month);

    var t = d3.transition().duration(750);

    // EXIT
    barrs.exit()
        .attr("fill", "red")
        .transition(t)
            .attr("y", y(0))
            .attr("height", 0)
        .remove();

    // UPDATE
    barrs.attr("x", (d) => x(d.month))
        .attr("y", (d) => y(d[value]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d[value]));

    // ENTER + UPDATE
    barrs.enter().append("rect")
        .attr("fill", "yellow")
        .attr("y", y(0))
        .attr("height", 0)
        .attr("x", (d) => x(d.month))
        .attr("width", x.bandwidth())
        .merge(barrs)
        .transition(t)
            .attr("x", (d) => x(d.month))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y(d[value]))
            .attr("height", (d) => height - y(d[value]))
}