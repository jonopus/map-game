var Orientation = require('./Orientation.js');

var regionCount = 0;

module.exports = Region;
function Region(x, y, xp, yp, zp, xm, ym, zm, claimable) {

	this.id = regionCount++;
	this.x = x;
	this.y = y;
	this.l = [xp, yp, zp, xm, ym, zm];
	this.claimable = claimable;
}

Region.prototype.getOrientations = getOrientations;
function getOrientations(orientation){
	var l = Orientation.rotateArray(this.l, orientation.index);
	return $.grep(Orientation.get(), function(orientation, i){
		return l[i];
	})
}

Region.O3 = [
	new Region(1,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,0,	false,	true,	true,	false,	true,	false,		true),
	new Region(3,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	true,		false),
	new Region(2,1,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.O2 = [
	new Region(1,0,	true,	false,	false,	false,	true,	false,		false),
	new Region(2,0,	true,	true,	true,	true,	false,	false,		true),
	new Region(3,0,	false,	false,	false,	true,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	true,		false),
	new Region(2,1,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.O1 = [
	new Region(1,0,	true,	false,	true,	false,	false,	false,		false),
	new Region(2,0,	true,	false,	true,	true,	true,	false,		true),
	new Region(3,0,	true,	false,	false,	true,	false,	false,		false),
	new Region(1,1,	false,	true,	false,	false,	false,	true,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	true,	false,		false)
];

Region.C3 = [
	new Region(1,0,	false,	false,	true,	false,	true,	false,		true),
	new Region(2,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(3,0,	true,	false,	false,	false,	true,	false,		true),
	new Region(1,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	false,	false,		true)
];

Region.C2 = [
	new Region(1,0,	true,	false,	true,	false,	false,	false,		false),
	new Region(2,0,	true,	false,	false,	true,	true,	false,		true),
	new Region(3,0,	true,	false,	false,	true,	false,	false,		false),
	new Region(1,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	false,	false,		true)
];

Region.C1 = [
	new Region(1,0,	false,	true,	false,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(3,0,	false,	false,	true,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	true,	false,		true),
	new Region(2,1,	true,	false,	false,	false,	false,	true,		true),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];