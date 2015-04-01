var d3 = require('d3');
var Orientation = require('../model/Orientation.js');

var svg;
var mainGroup;
var tilesGroup;

var scale = 40;
var d2 = Math.sqrt(3);
var centerH = 1/d2;

var triangle = [
	{x:scale*d2*.5,		y:scale*-1.5},
	{x:scale*d2*-1,		y:scale*0},
	{x:scale*d2*.5,		y:scale*1.5}
]
var trianglePoints = $.map(triangle, function(d) {
	return [
		d.x,
		d.y
	].join(',');
}).join(' ');

var hexagon = [
	{x:scale*d2*.5,		y:scale*-.5},
	{x:scale*d2*.5,		y:scale*.5},
	{x:scale*d2*0,		y:scale*1},
	{x:scale*d2*-.5,	y:scale*.5},
	{x:scale*d2*-.5,	y:scale*-.5},
	{x:scale*d2*0,		y:scale*-1}
]
var hexagonPoints = $.map(hexagon, function(d) {
	return [
		d.x,
		d.y
	].join(',');
}).join(' ');

module.exports = Renderer;
function Renderer() {
	svg = d3.select('body')
	.classed('map', true)
	.append('svg');

	mainGroup = svg.append('g')
	.attr('id', 'main-group');

	mainGroup.append('circle')
	.attr('class', 'center-mark')
	.attr('cx', 0)
	.attr('cy', 0)
	.attr('r', .2*scale);
	
	tilesGroup = mainGroup.append('g');

	$(window).on('resize', center);
	center();

	$('body').on('click', '.tile .region', handleRegionClick);
	$('body').on('click', '.nub', handleNubClick);
}

function handleRegionClick(event){
	$('body').trigger('MARK_CLICKED', [
		+$(this).closest('.tile').data('id'),
		+$(this).data('id')
	]);
}

function handleNubClick(event){
	$('body').trigger('NUB_CLICKED', [
		+$(this).data('x'),
		+$(this).data('y'),
		+$(this).data('o')
	]);
}

function center(){
	width = $(window).innerWidth();
	height = $(window).innerHeight();

	mainGroup.attr('transform', 'translate({0},{1})'.format(width/2, height/2));
	$('svg').css({
		width: width,
		height: height
	});
}

Renderer.prototype.render = function(game){
	var game = game;
	var tiles = game.getTiles();

	for (var i = tiles.length - 1; i >= 0; i--) {
		var tile = tiles[i];

		this.renderTile(tile)
	};
}

Renderer.prototype.renderNubs = function(nubs){
	for (var i = nubs.length - 1; i >= 0; i--) {
		var nub = nubs[i];

		this.renderNub(nub)
	};
}

Renderer.prototype.renderNub = function(tile){

	tileGroup = tilesGroup.append('g')
	.attr('class', 'nub')
	.attr('data-x', tile.x)
	.attr('data-y', tile.y)
	.attr('data-o', tile.orientation.index)
	.attr('transform',
		'translate({0},{1}) rotate({2})'
		.format(
			(tile.x*scale*d2) + (tile.y*scale*d2*.5),
			(tile.y*scale*1.5),
			tile.orientation.angle
		)
	);

	tileGroup.append('polygon')
	.attr('class', 'triangle')
	.attr('points', trianglePoints);
}

Renderer.prototype.renderTile = function(tile){

	tileGroup = tilesGroup.append('g')
	.attr('class', 'tile')
	.attr('data-id', tile.id)
	.attr('transform',
		'translate({0},{1}) rotate({2})'
		.format(
			(tile.x*scale*d2) + (tile.y*scale*d2*.5),
			(tile.y*scale*1.5),
			tile.orientation.angle
		)
	);

	tileGroup.append('polygon')
	.attr('class', 'triangle')
	.attr('points', trianglePoints);

	tileGroup.append('image')
	.attr('class', 'tile-img tile-img-' + tile.ports.id.toLowerCase())
	.attr('xlink:href', 'media/'+ tile.ports.id.toLowerCase()+'.png')
	.attr('width', '200px')
	.attr('height', '167px');
	
	var regions = tile.ports.getRegions();

	if(regions.indexOf(1) >= 0){
		//center
		tileGroup.append('g')
		.attr('class', 'region')
		.attr('data-id', 1)
		.attr('transform', 'translate({0},{1})'.format(
			scale*0,
			scale*0
		))
		.append('circle')
		.attr('r', .2*scale);
	}
	
	if(regions.indexOf(2) >= 0){
		//bottom right
		tileGroup.append('g')
		.attr('class', 'region')
		.attr('data-id', 2)
		.attr('transform', 'translate({0},{1})'.format(
			scale*d2*.25,
			scale*.75
		))
		.append('circle')
		.attr('r', .2*scale);
	}
	
	if(regions.indexOf(3) >= 0){
		//left
		tileGroup.append('g')
		.attr('class', 'region')
		.attr('data-id', 3)
		.attr('transform', 'translate({0},{1})'.format(
			scale*d2*-.5,
			scale*0
		))
		.append('circle')
		.attr('r', .2*scale);
	}
	
	if(regions.indexOf(4) >= 0){
		//top right
		tileGroup.append('g')
		.attr('class', 'region')
		.attr('data-id', 4)
		.attr('transform', 'translate({0},{1})'.format(
			scale*d2*.25,
			scale*-.75
		))
		.append('circle')
		.attr('r', .2*scale);
	}
	
	if(regions.indexOf(5) >= 0){
		//right
		tileGroup.append('g')
		.attr('class', 'region')
		.attr('data-id', 5)
		.attr('transform', 'translate({0},{1})'.format(
			scale*d2*.25,
			scale*0
		))
		.append('circle')
		.attr('r', .2*scale);
	}
}

Renderer.prototype.highlight = highlight;
function highlight(regions, className){
	$('.'+className)
	.attr("class", function(index, classNames) {
		return classNames.replace(className, '');
	});

	for (var i = regions.length - 1; i >= 0; i--) {
		var region = regions[i];
			
		var selector = '.tile[data-id="{0}"] .region[data-id="{1}"]'.format(region.tileId, region.regionId)

		$(selector)
		.attr("class", function(index, classNames) {
			return classNames + ' ' + className;
		});
	};
}