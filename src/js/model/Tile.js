var Region = require('./Region.js');
var Orientation = require('./Orientation.js');

var tileCount = 0;
var claimedRegions = [];

module.exports = Tile;
function Tile(regions, x, y, orientation, name) {
	this.x = x || 0;
	this.y = y || 0;

	this.name = name || '';
	this.id = ++tileCount;
	this.orientation = orientation || Orientation.XP;
	
	this.regions = regions;
}

Tile.prototype.getRegions = getRegions;
function getRegions(){
	var tile = this;

	var regions = $.map(this.regions, function(region, i){
		var point = Orientation.rotatePoint({x:region.x, y:region.y}, tile.orientation);
		
		region = jQuery.extend({}, region);
		region.tileId = tile.id
		region.l = Orientation.rotateArray(region.l, tile.orientation.index)
		region.x = point.x + tile.orientation.offset.x;
		region.y = point.y + tile.orientation.offset.y;

		
		return region;
	})

	$.each(regions, function(i, region){
		var regionSpace = Region.getRegionSpace(tile)
		region.x = regionSpace.x + region.x
		region.y = regionSpace.y + region.y
	})

	return regions;
}

Tile.prototype.getRegion = getRegion;
function getRegion(regionId){
	return $.grep(this.regions, function(region, i){
		return region.id === parseInt(regionId)
	})[0];
}

var d2 = Math.sqrt(3);
var a = d2*3.5
var o = 1.5
var h = Math.sqrt((a*a) + (o*o));
var rotate = 90 + Math.atan(a/-o) * (180/Math.PI);
var scale = h/(d2*4)
var w = 4
var h = 3 // triangle size

Tile.START_TILES = [
	new Tile(Region.O3, -1, -1, Orientation.YP, 'O3'),
	new Tile(Region.O3, -1, 0, null, 'O3'),
	new Tile(Region.O3, -1, 0, Orientation.YP, 'O3'),
	new Tile(Region.O3, 0, -1, null, 'O3'),
	new Tile(Region.O3, 0, -1, Orientation.YP, 'O3'),
	new Tile(Region.O3, 0, 0, null, 'O3')
]
Tile.getStartTiles = function(){
	return Tile.START_TILES;
}
Tile.TILES = [
	new Tile(Region.O3, null, null, null, 'O3'),
	new Tile(Region.O2, null, null, null, 'O2'),
	new Tile(Region.O1, null, null, null, 'O1'),
	new Tile(Region.C3, null, null, null, 'C3'),
	new Tile(Region.C2, null, null, null, 'C2'),
	new Tile(Region.C1, null, null, null, 'C1')
]
Tile.getTiles = function(){
	return Tile.TILES;
}
Tile.getTileSpace = function(region){
	var x = region.x;
	var y = region.y;

	var _x;
	var _y;

	_x = Math.floor(
		(x-1)	/w
	)
	_y = Math.floor(
		(
			y+_x
		)	/h
	)
	_x = Math.floor(
		(
			x-1-_y
		)	/w
	)
	_y = Math.floor(
		(
			y+_x
		)	/h
	)
	_x = Math.floor(
		(
			x-1-_y
		)	/w
	)
	_y = Math.floor(
		(
			y+_x
		)	/h
	)

	var offsetX = ((_x)*4)+_y;
	var offsetY = ((_y)*3)-_x;

	var o = x-offsetX-1 + y-offsetY > 2;
	
	return {
		x:_x,
		y:_y,
		o:o
	}
}