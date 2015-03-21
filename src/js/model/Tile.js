var Region = require('./Region.js');
var Orientation = require('./Orientation.js');

var tileCount = 0;
var claimedRegions = [];

module.exports = Tile;
function Tile(regions, x, y, orientation) {

	x = x || 0;
	y = y || 0;

	this.id = tileCount++;
	this.orientation = orientation || Orientation.XP;
	
	this.x = this.orientation.offsetVector.x + (x*4) + 2 + y;
	this.y = this.orientation.offsetVector.y + (y*3) + 0 - x;
		

	// this.x = (this.orientation.offsetVector.x + 1 + y) + (x*4);
	// this.y = (this.orientation.offsetVector.y - 3) + (y*3) - x;
	
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
		region.x = point.x + tile.x;
		region.y = point.y + tile.y;

		
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