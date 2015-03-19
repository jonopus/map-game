var Region = require('./Region.js');
var Orientation = require('./Orientation.js');

var tileCount = 0;
var claimedRegions = [];

module.exports = Tile;
function Tile(regions, x, y, orientation) {
	this.id = tileCount++;
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