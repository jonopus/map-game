var d3 = require('d3');

var svg;
var scale = 25;
var d2 = Math.sqrt(3);
var hexagon = [
	{x:d2,		y:.5},
	{x:d2,		y:1.5},
	{x:d2*.5,	y:2},
	{x:0,		y:1.5},
	{x:0,		y:.5},
	{x:d2*.5,	y:0}
]
var orthagonal = [
	{x:d2,		y:1},
	{x:d2*.75,	y:1.75},
	{x:d2*.25,	y:1.75},
	{x:0,		y:1},
	{x:d2*.25,	y:.25},
	{x:d2*.75,	y:.25}
]

module.exports = Renderer;
function Renderer(selector) {
	console.log('Renderer');

	svg = d3.select("body")
	.append("svg")
	.attr("width", 1000)
	.attr("height", 400)
	.append("g")
	.attr("transform", "translate(500,200)");

	$('svg').on('click', '.region', handleClickRegion);
	$('svg').on('mouseover', '.region', handleMouseoverRegion);
	$('svg').on('mouseout', '.region', handleMouseoutRegion);
}

Renderer.prototype.render = render;
function render(regions){
	svg.selectAll("*").remove();

	for (var i = regions.length - 1; i >= 0; i--) {
		renderRegion(regions[i], i);
	};
}

function handleClickRegion(){
	var region = d3.select(this);

	region.transition().duration(300)
	.style("opacity", .5);

	$('body').trigger('REGION_CLICKED', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function handleMouseoverRegion(){
	d3.select(this).transition().duration(300)
	.style("opacity", .7);
}

function handleMouseoutRegion(){
	d3.select(this).transition().duration(300)
	.style("opacity", 1);
}

function renderRegion(region, index){
	var x = ((region.x * d2) + (region.y * (d2*.5)));
	var y = (region.y)*1.5;
	var cx = (d2*.5);
	var cy = 1;

	var polygon = [];
	var lines = []

	for (var i = hexagon.length - 1; i >= 0; i--) {
		var point = hexagon[i];
		polygon.push({
			x:point.x*scale,
			y:point.y*scale
		});
	};

	for (var i = orthagonal.length - 1; i >= 0; i--) {
		var point = orthagonal[i];
		if(region.l[i]){
			lines.push([
			{
				x:cx*scale,
				y:cy*scale
			},
			{
				x:point.x*scale,
				y:point.y*scale
			}
			])
		}
	};

	var regionGroup = svg.append("g")
	.attr("transform", "translate("+(x*scale)+","+(y*scale)+")")
	.attr("class", 'region')
	.attr("data-region-id", region.id)
	.attr("data-tile-id", region.tileId);

	regionGroup.selectAll("hex" + index)
	.data([polygon])
	.enter()
	.append("polygon")
	.attr("points",function(d) { 
		return d.map(function(d) {
			return [
			d.x,
			d.y
			].join(",");
		}).join(" ");
	});

	regionGroup.selectAll("lines" + index + i)
	.data(lines)
	.enter()
	.append("polygon")
	.attr("points",function(d) { 
		return d.map(function(d) {
			return [
			d.x,
			d.y
			].join(",");
		}).join(" ");
	})
	.attr("stroke-width", 1)
	.attr("stroke", "red");

	//region.claim

	if(region.claimable){

	var circle = regionGroup.append("circle")
		.attr("cx", cx*scale)
		.attr("cy", cy*scale)
		.attr("r", 10)
		.attr("fill", '#555');

		if(region.claim){
			circle.attr("stroke", "red");

			var circle = regionGroup.append("circle")
				.attr("cx", cx*scale)
				.attr("cy", cy*scale)
				.attr("r", 6)
				.attr("fill", 'red');
		}
	}

}

