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

Tile.prototype.getRegionSpace = getRegionSpace;
function getRegionSpace(){

	var point = {
		x:(this.x*4) + 2 + this.y,
		y:(this.y*3) + 0 - this.x
	}

	switch(this.orientation.index){
		case 1:
		case 3:
		case 5:
		point.x += 2;
		point.y += 1;
		break;


	}

	return point
}