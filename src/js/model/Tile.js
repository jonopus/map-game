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