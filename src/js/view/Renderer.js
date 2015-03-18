var d3 = require('d3');

var context;
var scale = 25;
var d2 = Math.sqrt(3);
var hexagon = [
{x:scale*(d2),		y:scale*(.5)},
{x:scale*(d2),		y:scale*(1.5)},
{x:scale*(d2*.5),	y:scale*(2)},
{x:scale*0,			y:scale*(1.5)},
{x:scale*0,			y:scale*(.5)},
{x:scale*(d2*.5),	y:scale*(0)}
]
var orthagonal = [
{x:scale*(d2),		y:scale*(1)},
{x:scale*(d2*.75),	y:scale*(1.75)},
{x:scale*(d2*.25),	y:scale*(1.75)},
{x:scale*(0),		y:scale*(1)},
{x:scale*(d2*.25),	y:scale*(.25)},
{x:scale*(d2*.75),	y:scale*(.25)}
]

module.exports = Renderer;
function Renderer(selector) {
	console.log('Renderer');


	/*
	var c = document.getElementById(selector);
	context = c.getContext("2d");
	*/

	context = d3.select("body")
	.append("svg")
	.attr("width", 1000)
	.attr("height", 400)
	.append("g")
	.attr("transform", "translate(500,200)");
}

Renderer.prototype.render = render;
function render(grid){
	renderRegions(grid.getRegions());
}

function renderRegions(regions){
	for (var i = regions.length - 1; i >= 0; i--) {
		renderRegion(regions[i], i);
	};
}

function renderRegion(region, index){
	var x = ((region.x * d2) + (region.y * (d2*.5))) * scale;
	var y = (region.y * scale)*1.5;
	var cx = (d2*.5) * scale;
	var cy = 1 * scale;

	var polygon = [];

	for (var i = hexagon.length - 1; i >= 0; i--) {
		var point = hexagon[i];
		polygon.push({
			x:x + point.x,
			y:y + point.y
		});
	};

	context.selectAll("hex" + index)
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
	})
	.attr("stroke-width",1);

	var lines = []

	for (var i = orthagonal.length - 1; i >= 0; i--) {
		var point = orthagonal[i];
		if(region.l[i]){
			lines.push([
				{
					x:x + cx,
					y:y + cy
				},
				{
					x:x + point.x,
					y:y + point.y
				}
			])
		}
	};


	context.selectAll("lines" + index + i)
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

}

