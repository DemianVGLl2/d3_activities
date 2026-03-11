/*
*    main.js
*/


var margin = { left: 100, right: 10, top: 10, bottom: 100 };

var width = 700;
var height = 500;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Scales
var x = d3.scaleLog()
	.domain([142, 150000])
	.range([0, width])
	.base(10);

var y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

// Axis groups
var xAxisGroup = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + height + ")");

var yAxisGroup = g.append("g")
	.attr("class", "y axis");

// Axis calls
var xAxisCall = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat((d) => "$" + d);

var yAxisCall = d3.axisLeft(y);

xAxisGroup.call(xAxisCall);
yAxisGroup.call(yAxisCall);

// x label
g.append("text")
	.attr("x", width/2)
	.attr("y", height + 60)
	.attr("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Income per capita (USD)");

// y label
g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("x", -(height/2))
	.attr("y", -60)
	.attr("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Life Expectancy (years)");

// Year label
var yearLabel = g.append("text")
.attr("x", width - 40)
.attr("y", height - 20)
.attr("text-anchor", "middle")
.style("font-size", "40px")
.style("opacity", "0.4")
.text("1800");

// legend
var continents = ["africa", "americas", "asia", "europe"];

var legend = g.append("g")
.attr("transform", "translate(" + (width-10) + ", " + (height-125) + ")");

continents.forEach((continent, i) => {
	var legendRow = legend.append("g")
	.attr("transform", "translate(0, " + (i * 20) + ")");
	
	legendRow.append("rect")
	.attr("width", 10)
	.attr("height", 10)
	.attr("fill", color(continent));
	
	legendRow.append("text")
	.attr("x", -10)
	.attr("y", 10)
	.attr("text-anchor", "end")
	.style("text-transform", "capitalize")
	.text(continent);
});

d3.json("data/data.json").then(function(data){
	const formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
			var dataExists = (country.income && country.life_exp);
			return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		});
	});

	var timeIndex = 0;

	d3.interval(() => {
		timeIndex = (timeIndex + 1) % formattedData.length;
		update(formattedData[timeIndex], timeIndex);
	}, 1000);

	update(formattedData[0], 0);
})

function update(data, timeIndex) {
	var t = d3.transition().duration(750);

	var circles = g.selectAll("circle")
		.data(data, (d) => d.country);

	circles.exit()
		.transition(t)
		.attr("r", 0)
		.remove();

	circles.enter().append("circle")
		.attr("fill", (d) => color(d.continent))
		.attr("cx", (d) => x(d.income))
		.attr("cy", (d) => y(d.life_exp))
		.attr("r", 0)
		.merge(circles)
		.transition(t)
			.attr("cx", (d) => x(d.income))
			.attr("cy", (d) => y(d.life_exp))
			.attr("r", (d) => Math.sqrt(area(d.population / Math.PI)));

		yearLabel.text(1800 + timeIndex)
}