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

Tile.getTileSpace = function(region){

	var x
	var y
	var offsetX
	var offsetY
	var localX
	var localY
	var o

	offsetX = Math.floor(region.x/4)
	offsetY = Math.floor(region.y/3)

	x = Math.floor((region.x - offsetY)/4)
	y = Math.floor((region.y + offsetX)/3)

	localX = region.x - ((x*4) + y);
	localY = region.y - ((y*3) - x);

	o = localX + localY > 3;

	return {
		x:x,
		y:y,
		o:o
	}
}