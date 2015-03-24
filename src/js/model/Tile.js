var Region = require('./Region.js');
var Orientation = require('./Orientation.js');

var tileCount = 0;
var claimedRegions = [];

module.exports = Tile;
function Tile(regions, x, y, orientation) {

	this.x = x || 0;
	this.y = y || 0;

	this.id = tileCount++;
	this.orientation = orientation || Orientation.XP;
	
	this.regions = regions;
}

Tile.prototype.getRegions = getRegions;
function getRegions(useNubs){
	var tile = this;

	var regions = $.map(useNubs ? Region.O3 : this.regions, function(region, i){
		var point = Orientation.rotatePoint({x:region.x, y:region.y}, tile.orientation);
		
		region = jQuery.extend({}, region);
		region.tileId = tile.id
		region.l = Orientation.rotateArray(region.l, tile.orientation.index)
		region.x = point.x + tile.orientation.offset.x;
		region.y = point.y + tile.orientation.offset.y;

		
		return region;
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

	var o = ((region.x+400)%4) + ((region.y+300)%3) > 3;

	console.log(
		'getTileSpace',
		((region.x+400)%4),
		((region.y+300)%3),
		((region.x+400)%4) + ((region.y+300)%3),
		o
	);


	return {
		x:_x,
		y:_y,
		o:o
	}
}