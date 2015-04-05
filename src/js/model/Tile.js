var Ports = require('./Ports.js');
var Orientation = require('./Orientation.js');

var tileCount = 0;

module.exports = Tile;
function Tile(x, y, ports, orientation) {
	this.id = ++tileCount;
	this.x = x || 0;
	this.y = y || 0;
	this.ports = ports || Ports.O3;
	this.orientation = orientation || Orientation.XP;
}

Tile.prototype.clone = function(){
	return new Tile(this.x, this.y, this.ports, this.orientation);
}

Tile.prototype.getPorts = function(){
	return new Ports(
		this.ports.id,
		Orientation.rotateArray(
			this.ports.ports,
			this.orientation.index*3
		)
	);
}

Tile.prototype.getPortVectors = function(regionId){
	var indices = this.getPorts().getIndices(regionId);
	var vectors = Ports.getVectors(indices);
	var tile = this;
	return $.map(vectors, function(vector){
		vector.x = tile.x + vector.o.vector.x
		vector.y = tile.y + vector.o.vector.y
		return vector;
	});
}

Tile.TILE_TYPES = [
	new Tile(0, 0, Ports.O3),
	new Tile(0, 0, Ports.O2),
	new Tile(0, 0, Ports.O1),
	new Tile(0, 0, Ports.C3),
	new Tile(0, 0, Ports.C2),
	new Tile(0, 0, Ports.C1)
]
Tile.getTileTypes = function(){
	return Tile.TILE_TYPES;
}

Tile.START_TILES = [
	new Tile(1, 0, Ports.O3, Orientation.XP),
	new Tile(0, 1, Ports.O3, Orientation.XN),
	new Tile(-1, 1, Ports.O3, Orientation.ZP),
	new Tile(-1, 0, Ports.O3, Orientation.XN),
	new Tile(0, -1, Ports.O3, Orientation.YN),
	new Tile(1, -1, Ports.O3, Orientation.XN)
]

Tile.getStartTiles = function(){
	return Tile.START_TILES;
}
