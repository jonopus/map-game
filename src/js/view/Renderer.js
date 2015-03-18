//var d3 = require('d3');

var context;
var scale = 50;
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

	var c = document.getElementById(selector);
	context = c.getContext("2d");

	/*
	var vis = d3.select("body").append("svg")
	.attr("width", 1000)
	.attr("height", 667),

	scaleX = d3.scale.linear()
	.domain([-30,30])
	.range([0,600]),

	scaleY = d3.scale.linear()
	.domain([0,50])
	.range([500,0]),

	poly = [{"x":0.0, "y":25.0},
	{"x":8.5,"y":23.4},
	{"x":13.0,"y":21.0},
	{"x":19.0,"y":15.5}];

	vis.selectAll("polygon")
	.data([poly])
	.enter().append("polygon")
	.attr("points",function(d) { 
		return d.map(function(d) { return [scaleX(d.x),scaleY(d.y)].join(","); }).join(" ");})
	.attr("stroke","black")
	.attr("stroke-width",2);
	*/
}

Renderer.prototype.render = render;
function render(grid){
	renderRegions(grid.getRegions());
}

function renderRegions(regions){
	for (var i = regions.length - 1; i >= 0; i--) {
		renderRegion(regions[i]);
	};
}

function renderRegion(region){

	var x = ((region.x * d2) + (region.y * (d2*.5))) * scale;
	var y = (region.y * scale)*1.5;
	var cx = (d2*.5) * scale;
	var cy = 1 * scale;

	context.moveTo(x + hexagon[0].x, y + hexagon[0].y);

	for (var i = hexagon.length - 1; i >= 0; i--) {
		var point = hexagon[i];
		context.lineTo(x + point.x, y + point.y);
	};

	for (var i = orthagonal.length - 1; i >= 0; i--) {
		var point = orthagonal[i];
		if(region.l[i]){
			context.moveTo(x + cx, y + cy);
			context.lineTo(x + point.x, y + point.y);
		}
	};

	context.stroke();
}

