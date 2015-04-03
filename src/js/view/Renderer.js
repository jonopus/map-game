var d3 = require('d3');
var Orientation = require('../model/Orientation.js');

var svg;
var mainGroup;
var tileTypesGroup;
var nubsGroup;
var tilesGroup;
var tilePreviewGroup;
var rotateButton;

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
	.classed('center-mark', true)
	.attr('cx', 0)
	.attr('cy', 0)
	.attr('r', .2*scale);

	rotateButton = svg.append('circle')
	.classed('rotate-button', true)
	.attr('cx', 0)
	.attr('cy', 0)
	.attr('r', 1*scale);
	
	tileTypesGroup = svg.append('g')
	.classed('tile-types-group', true);
	nubsGroup = mainGroup.append('g')
	.classed('nubs-group', true);
	tilesGroup = mainGroup.append('g')
	.classed('tiles-group', true);
	tilePreviewGroup = mainGroup.append('g')
	.classed('preview-group', true);

	$(window).on('resize', center);
	center();

	$('body').on('click', '.tile .region', handleRegionClick);
	$('body').on('click', '.nub', handleNubClick);
	$('body').on('click', '.tile-type', handleTileTypeClick);
	$('body').on('click', '.rotate-button', handleRotateClick);
	$('body').on('mouseover', '.nub', handleMouseoverNub);
	$('body').on('mouseout', '.nub', handleMouseoutNub);
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

function handleTileTypeClick(event){
	$('body').trigger('TILE_TYPE_CLICKED', [
		$(this).data('id')
	]);
}

function handleRotateClick(event){
	$('body').trigger('ROTATE_CLICKED');
}

function handleMouseoverNub(event){
	$('body').trigger('NUB_MOUSEOVER', [
		+$(this).data('x'),
		+$(this).data('y'),
		+$(this).data('o')
	]);
}

function handleMouseoutNub(event){
	$('body').trigger('NUB_MOUSEOUT', [
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

	rotateButton.attr('transform', 'translate({0},{1})'.format(width-(2*scale), (2*scale)));

}

Renderer.prototype.renderTileTypes = function(tiles){
	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];

		var tileTypeGroup = tileTypesGroup.append("g")
		.attr("class", "tile-type")
		.attr("data-id", tile.ports.id)
		.attr("transform", "translate({0},{1}) rotate(90)".format(80, 70 + (i*3.25*scale)))


		this.renderTile(tile, tileTypeGroup);
	};
}

Renderer.prototype.render = function(tiles){
	tilesGroup.selectAll("*").remove();

	for (var i = tiles.length - 1; i >= 0; i--) {
		var tile = tiles[i];

		this.renderTile(tile, tilesGroup)
	};
}

Renderer.prototype.renderNubs = function(nubs){
	nubsGroup.selectAll("*").remove();

	for (var i = nubs.length - 1; i >= 0; i--) {
		var nub = nubs[i];

		this.renderNub(nub)
	};
}

Renderer.prototype.renderNub = function(tile){
	var nubGroup = nubsGroup.append('g')
	.classed('nub', true)
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

	nubGroup.append('polygon')
	.classed('triangle', true)
	.attr('points', trianglePoints);
}

Renderer.prototype.selectNub = function(x, y){
	var className = 'selected'

	$('.'+className)
	.attr("class", function(index, classNames) {
		return classNames.replace(className, '');
	});

	var selector = '.nub[data-x="{0}"][data-y="{1}"]'.format(x, y);

	console.log('selector', $(selector));
	
	$(selector)
	.attr("class", function(index, classNames) {
		return classNames + ' ' + className;
	});
}

Renderer.prototype.renderPreviewTile = function(tile, useTilesGroup){
	tilePreviewGroup.selectAll("*").remove();

	if(!tile) return;

	var group = tilePreviewGroup;

	if(useTilesGroup){
		group = tilesGroup
	}
	
	this.renderTile(tile, group)
	.classed('preview');
}

Renderer.prototype.renderTile = function(tile, group){

	var tileGroup = group.append('g')
	.classed('tile', true)
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
	.classed('triangle', true)
	.attr('points', trianglePoints);

	tileGroup.append('image')
	.classed('tile-img tile-img-' + tile.ports.id.toLowerCase(), true)
	.attr('xlink:href', 'media/'+ tile.ports.id.toLowerCase()+'.png')
	.attr('width', '200px')
	.attr('height', '167px');
	
	var regions = tile.ports.getRegions();

	if(regions.indexOf(1) >= 0){
		//center
		tileGroup.append('g')
		.classed('region', true)
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
		.classed('region', true)
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
		.classed('region', true)
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
		.classed('region', true)
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
		.classed('region', true)
		.attr('data-id', 5)
		.attr('transform', 'translate({0},{1})'.format(
			scale*d2*.25,
			scale*0
		))
		.append('circle')
		.attr('r', .2*scale);
	}

	return tileGroup;
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