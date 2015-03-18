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

	console.log('Tile getRegions', this);

	var tile = this;

	var regions = $.map(this.regions, function(region, i){
		var region = jQuery.extend({}, region);
		var point = Orientation.rotate({x:region.x, y:region.y}, tile.orientation);

		console.log('region', region);
		console.log('point', point);
		
		region.x = point.x + tile.x;
		region.y = point.y + tile.y;
		
		return region;
	})

	return regions;
}