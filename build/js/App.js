(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Grid = require('./model/Grid.js');
var Tile = require('./model/Tile.js');
var Region = require('./model/Region.js');
var Orientation = require('./model/Orientation.js');
var Renderer = require('./view/Renderer.js');

//http://d3js.org/
//http://www.redblobgames.com/grids/hexagons/

function App(){
	console.log('App');

	var grid = new Grid();
	
	/*
	grid.addRegions(new Tile(Region.O3, 2, 4, Orientation.XP).getRegions());
	grid.addRegions(new Tile(Region.O3, 2, 4, Orientation.YP).getRegions());
	grid.addRegions(new Tile(Region.O3, 2, 4, Orientation.ZP).getRegions());
	grid.addRegions(new Tile(Region.O3, 2, 4, Orientation.XM).getRegions());
	grid.addRegions(new Tile(Region.O3, 2, 4, Orientation.YM).getRegions());
	grid.addRegions(new Tile(Region.O3, 2, 4, Orientation.ZM).getRegions());
	*/
	
	grid.addRegions(new Tile(Region.O3, 0, 4).getRegions());
	grid.addRegions(new Tile(Region.O2, 4, 4).getRegions());
	grid.addRegions(new Tile(Region.O1, 8, 4).getRegions());
	
	grid.addRegions(new Tile(Region.C3, 0, 8).getRegions());
	grid.addRegions(new Tile(Region.C2, 4, 8).getRegions());
	grid.addRegions(new Tile(Region.C1, 8, 8).getRegions());
	
	new Renderer('mapCanvas').render(grid);
}

$(function(){
	new App();
});
},{"./model/Grid.js":2,"./model/Orientation.js":3,"./model/Region.js":4,"./model/Tile.js":5,"./view/Renderer.js":6}],2:[function(require,module,exports){
module.exports = Grid;
function Grid() {
	console.log('Grid');
	this.regions = [];
}

Grid.prototype.addRegions = addRegions;
function addRegions(regions){
	this.regions = this.regions.concat(regions);
}

Grid.prototype.addRegion = addRegion;
function addRegion(region){
	this.regions.push(region);
}

Grid.prototype.getRegions = getRegions;
function getRegions(){
	return this.regions;
}
},{}],3:[function(require,module,exports){
module.exports = Orientation;
function Orientation(index, angle){
	this.index = index
	this.angle = angle
}

Orientation.XP = new Orientation(0, 0);
Orientation.YP = new Orientation(1, 60);
Orientation.ZP = new Orientation(2, 120);
Orientation.XM = new Orientation(3, 180);
Orientation.YM = new Orientation(4, 210);
Orientation.ZM = new Orientation(5, 270);


var orientations = [
Orientation.XP,
Orientation.YP,
Orientation.ZP,
Orientation.XM,
Orientation.YM,
Orientation.ZM
]

Orientation.rotate = rotate;
function rotate(point, orientation){
	
	var
	x = point.x,
	y = point.y,
	z = -point.x-point.y;

	var
	_x,
	_y,
	_z;

	switch(orientation){
		case Orientation.XP:
			return point;
			break;
		case Orientation.YP:
			_x = -y;
			_y = -z;
			_z = -x;
			break;
		case Orientation.ZP:
			_x = z;
			_y = x;
			_z = y;
			break;
		case Orientation.XM:
			_x = -x;
			_y = -y;
			_z = -z;
			break;
		case Orientation.YM:
			_x = y;
			_y = z;
			_z = x;
			break;
		case Orientation.ZM:
			_x = -z;
			_y = -x;
			_z = -y;
			break;
	}

	return {x:_x, y:-_x-_z};
}
},{}],4:[function(require,module,exports){
var Orientation = require('./Orientation.js');

module.exports = Region;
function Region(x, y, xp, yp, zp, xm, ym, zm, claimable) {
	this.x = x;
	this.y = y;
	this.l = [xp, yp, zp, xm, ym, zm];
	this.claimable = claimable;
}

Region.O3 = [
	new Region(1,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,0,	false,	true,	true,	false,	true,	false,		false),
	new Region(3,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	true,		false),
	new Region(2,1,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.O2 = [
	new Region(1,0,	true,	false,	false,	false,	true,	false,		false),
	new Region(2,0,	true,	true,	true,	true,	false,	false,		false),
	new Region(3,0,	false,	false,	false,	true,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	true,		false),
	new Region(2,1,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.O1 = [
	new Region(1,0,	true,	false,	true,	false,	false,	false,		false),
	new Region(2,0,	true,	false,	true,	true,	true,	false,		false),
	new Region(3,0,	true,	false,	false,	true,	false,	false,		false),
	new Region(1,1,	false,	true,	false,	false,	false,	true,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	true,	false,		false)
];

Region.C3 = [
	new Region(1,0,	false,	false,	true,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(3,0,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	false,	false,		false)
];

Region.C2 = [
	new Region(1,0,	true,	false,	true,	false,	false,	false,		false),
	new Region(2,0,	true,	false,	false,	true,	true,	false,		false),
	new Region(3,0,	true,	false,	false,	true,	false,	false,		false),
	new Region(1,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	false,	false,		false)
];

Region.C1 = [
	new Region(1,0,	false,	true,	false,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(3,0,	false,	false,	true,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	true,	false,		false),
	new Region(2,1,	true,	false,	false,	false,	false,	true,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.XX = [
	new Region(1,0,	true,	false,	true,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	true,	false,		false),
	new Region(3,0,	false,	false,	false,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	false,		false),
	new Region(2,1,	true,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	false,	false,	false,	false,		false)
];

},{"./Orientation.js":3}],5:[function(require,module,exports){
var Region = require('./Region.js');
var Orientation = require('./Orientation.js');

module.exports = Tile;
function Tile(regions, x, y, orientation) {
	this.x = x;
	this.y = y;
	this.orientation = orientation || Orientation.XP;
	console.log('Tile');
	this.regions = regions;
}

Tile.prototype.getRegions = getRegions;
function getRegions(){
	var tile = this;

	var regions = $.map(this.regions, function(region, i){
		
		region = jQuery.extend({}, region);
		var point = Orientation.rotate({x:region.x, y:region.y}, tile.orientation);

		region.x = point.x + tile.x;
		region.y = point.y + tile.y;

		var copy = region.l.slice(0);
		var end = copy.splice(-tile.orientation.index, tile.orientation.index);
		region.l = end.concat(copy);
		
		return region;
	})

	return regions;
}
},{"./Orientation.js":3,"./Region.js":4}],6:[function(require,module,exports){
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


},{}]},{},[1]);
