var d3 = require('d3');
var Orientation = require('../model/Orientation.js');
var Region = require('../model/Region.js');

var svg;
var mainGroup;
var regionsGroup;
var tilesGroup;
var scale = 20;
var offsetX = 0;
var offsetY = 150;
var d2 = Math.sqrt(3);
var rotate = 90 + Math.atan((d2*3.5)/-1.5) * (180/Math.PI);

var hexagon = [
	{x:(d2*-.5) + d2,		y:(-1) + .5},
	{x:(d2*-.5) + d2,		y:(-1) + 1.5},
	{x:(d2*-.5) + d2*.5,	y:(-1) + 2},
	{x:(d2*-.5) + 0,		y:(-1) + 1.5},
	{x:(d2*-.5) + 0,		y:(-1) + .5},
	{x:(d2*-.5) + d2*.5,	y:(-1) + 0}
]
var triangleA = [
	{x:d2*1.5,	y:1.5},
	{x:d2*-2,	y:3},
	{x:d2*-1,	y:-3}
]
var triangleB = [
	{x:d2*1.5,	y:-1.5},
	{x:d2*.5,	y:4.5},
	{x:d2*-2,	y:0}
]
var orthagonal = [
	{x:(d2*-.5) + d2,		y:(-1) + 1},
	{x:(d2*-.5) + d2*.75,	y:(-1) + 1.75},
	{x:(d2*-.5) + d2*.25,	y:(-1) + 1.75},
	{x:(d2*-.5) + 0,		y:(-1) + 1},
	{x:(d2*-.5) + d2*.25,	y:(-1) + .25},
	{x:(d2*-.5) + d2*.75,	y:(-1) + .25}
]

module.exports = Renderer;
function Renderer(selector) {
	svg = d3.select("body")
	.append("svg")
	.attr("width", 1000)
	.attr("height", 900)
	


	mainGroup = svg.append("g")
	.attr("transform", "translate(" + offsetX + "," + offsetY + ") rotate(" + rotate + ")");

	mainGroup.append("circle")
	.attr("class", 'claim-mark')
	.attr("cx", 0)
	.attr("cy", 0)
	.attr("r", .2*scale);
	
	tilesGroup = mainGroup.append("g")
	regionsGroup = mainGroup.append("g")

	$('svg').on('click', '.region', handleClickRegion);
	$('svg').on('click', '.nub', handleClickNub);
	$('svg').on('mouseover', '.region', handleMouseoverRegion);
	$('svg').on('mouseout', '.region', handleMouseoutRegion);
	$('body').on('mousemove', handleMouseMoveSVG);
}

function handleClickRegion(){
	var region = d3.select(this);
	$('body').trigger('REGION_CLICKED', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function handleClickNub(){
	var region = d3.select(this);
	$('body').trigger('NUB_CLICKED', [parseInt(region.attr("data-x")), parseInt(region.attr("data-y")), parseInt(region.attr("data-o"))])
}

function handleMouseoverRegion(){
	var region = d3.select(this);
	$('body').trigger('REGION_MOUSEOVER', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function handleMouseoutRegion(){
	var region = d3.select(this);
	$('body').trigger('REGION_MOUSEOUT', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function handleMouseMoveSVG(){
	//if($(event.target).is('svg')){
		var _x = event.clientX - offsetX;
		var _y = event.clientY - offsetY;

		var x = Math.round((((_x) / d2) - (_y / (d2/.5)))/scale);
		var y = Math.round((_y/1.5)/scale);

		$('body').trigger('STAGE_MOUSEMOVE', [x, y]);
	//}
}

Renderer.prototype.renderRegions = renderRegions;
function renderRegions(regions){
	regionsGroup.selectAll("*").remove();

	for (var i = regions.length - 1; i >= 0; i--) {
		renderRegion(regions[i], i);
	};
}

Renderer.prototype.renderTiles = renderTiles;
function renderTiles(regions){
	tilesGroup.selectAll("*").remove();

	for (var i = regions.length - 1; i >= 0; i--) {
		renderTile(regions[i], i);
	};
}

function renderTile(tile, index){

	var regionSpace = Region.getRegionSpace(tile)

	var x = (((regionSpace.x) * d2) + (regionSpace.y * (d2*.5)));
	var y = (regionSpace.y)*1.5;
	var cx = 0;
	var cy = 0;

	var polygon = [];

	var triangle = tile.orientation.index%2 ? triangleA : triangleB
	
	for (var i = triangle.length - 1; i >= 0; i--) {
		var point = triangle[i];
		polygon.push({
			x:point.x*scale,
			y:point.y*scale
		});
	};

	var tileGroup = tilesGroup.append("g")
	.attr("transform", "translate("+(x*scale)+","+(y*scale)+")")
	.attr("class", tile.isNub ? 'nub' : 'tile')
	.attr("id", 'tile-' + tile.id)
	.attr("data-tile-id", tile.id)
	.attr("data-x", tile.x)
	.attr("data-y", tile.y)
	.attr("data-o", tile.orientation.index);

	tileGroup.selectAll("tri" + index)
	.data([polygon])
	.enter()
	.append("polygon")
	.attr("class", 'triangle')
	.attr("points",function(d) { 
		return d.map(function(d) {
			return [
			d.x,
			d.y
			].join(",");
		}).join(" ");
	});
}

Renderer.prototype.highlight = highlight;
function highlight(className, regions){
	
	$('.'+className)
	.attr("class", function(index, classNames) {
		return classNames.replace(className, '');
	});

	for (var i = regions.length - 1; i >= 0; i--) {
		var region = regions[i];
		
		$('#region-' + region.tileId + '-' + region.id)
		.attr("class", function(index, classNames) {
			return classNames + ' ' + className;
		});
	};

}

function renderRegion(region, index){
	var x = (((region.x) * d2) + (region.y * (d2*.5)));
	var y = (region.y)*1.5;
	var cx = 0;
	var cy = 0;

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

	var regionGroup = regionsGroup.append("g")
	.attr("id", 'region-' + region.tileId + '-' + region.id)
	.attr("transform", "translate("+(x*scale)+","+(y*scale)+")")
	.attr("class", 
		'region'
		+ (region.claimed ? ' claimed ' + region.claimed.player.color : '')
	)
	.style("opacity", region.highlight ? .5 : 1)
	.attr("data-region-id", region.id)
	.attr("data-tile-id", region.tileId)
	.attr("data-x", region.x)
	.attr("data-y", region.y);

	
	regionGroup.selectAll("hex" + index)
	.data([polygon])
	.enter()
	.append("polygon")
	.attr("class", 'hexagon')
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
	.attr("stroke-width", .05*scale)
	.attr("stroke", "red");

	//region.claim

	if(region.claimable){

		regionGroup.append("circle")
		.attr("class", 'claimable')
		.attr("r", .35*scale)
		.attr("fill", '#555');


		regionGroup.append("circle")
		.attr("class", 'claim-mark')
		.attr("r", .2*scale);
	}

}

