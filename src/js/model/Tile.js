var Ports = require('./Ports.js');
var Orientation = require('./Orientation.js');

var tileCount = 0;

module.exports = Tile;
function Tile(x, y, ports, orientation) {
	this.id = ++tileCount;
	this.x = x || 0;
	this.y = y || 0;
	this.ports = ports;
	this.orientation = orientation || Orientation.XP;
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
