var Orientation = require('./Orientation.js');

Ports.O3 = new Ports('O3', [
	0, 1, 0,
	0, 0, 0,
	0, 1, 0,
	0, 0, 0,
	0, 1, 0,
	0, 0, 0
]);

Ports.O2 = new Ports('O2', [
	1, 0, 1,
	0, 0, 0,
	0, 1, 0,
	0, 0, 0,
	0, 1, 0,
	0, 0, 0
]);

Ports.O1 = new Ports('O1', [
	0, 1, 0,
	0, 0, 0,
	1, 0, 1,
	0, 0, 0,
	1, 0, 1,
	0, 0, 0
]);

Ports.C3 = new Ports('C3', [
	4, 0, 2,
	0, 0, 0,
	2, 0, 3,
	0, 0, 0,
	3, 0, 4,
	0, 0, 0
]);

Ports.C2 = new Ports('C2', [
	0, 5, 0,
	0, 0, 0,
	5, 0, 3,
	0, 0, 0,
	3, 0, 5,
	0, 0, 0
]);

Ports.C1 = new Ports('C1', [
	4, 0, 2,
	0, 0, 0,
	0, 2, 0,
	0, 0, 0,
	0, 4, 0,
	0, 0, 0
]);

module.exports = Ports;
function Ports(id, ports) {
	this.id = id;
	this.ports = ports;
}

Ports.getVectors = function(indices){
	return $.map(indices, function(index){
		return {
			o:Orientation.get()[Math.floor((index)/3)],
			i:index
		}
	});
}

Ports.prototype.getRegions = function(){
	return this.ports.filter(function(e,i,array){
	    return i == array.indexOf(e);
	});
}

Ports.prototype.getIndices = function(index){
	var indices = [];

	$.each(this.ports, function(i, item){
		if(index === item){
			indices.push(i)
		}
	});

	return indices
}