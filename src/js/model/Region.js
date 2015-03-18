var Orientation = require('./Orientation.js');

module.exports = Region;
function Region(x, y, xp, yp, zp, xm, ym, zm, claimable) {
	this.x = x;
	this.y = y;
	this.l = [xp, yp, zp, xm, ym, zm];
	this.claimable = claimable;
}

Region.O3 = [
	new Region(1,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,0,	false,	true,	true,	false,	true,	false,		false),
	new Region(3,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	true,		false),
	new Region(2,1,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.O2 = [
	new Region(1,0,	true,	false,	false,	false,	true,	false,		false),
	new Region(2,0,	true,	true,	true,	true,	false,	false,		false),
	new Region(3,0,	false,	false,	false,	true,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	true,		false),
	new Region(2,1,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.O1 = [
	new Region(1,0,	true,	false,	true,	false,	false,	false,		false),
	new Region(2,0,	true,	false,	true,	true,	true,	false,		false),
	new Region(3,0,	true,	false,	false,	true,	false,	false,		false),
	new Region(1,1,	false,	true,	false,	false,	false,	true,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	true,	false,		false)
];

Region.C3 = [
	new Region(1,0,	false,	false,	true,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(3,0,	true,	false,	false,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	false,	false,		false)
];

Region.C2 = [
	new Region(1,0,	true,	false,	true,	false,	false,	false,		false),
	new Region(2,0,	true,	false,	false,	true,	true,	false,		false),
	new Region(3,0,	true,	false,	false,	true,	false,	false,		false),
	new Region(1,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(2,1,	false,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	true,	false,	false,	false,		false)
];

Region.C1 = [
	new Region(1,0,	false,	true,	false,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	false,	false,		false),
	new Region(3,0,	false,	false,	true,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	true,	false,		false),
	new Region(2,1,	true,	false,	false,	false,	false,	true,		false),
	new Region(1,2,	false,	false,	false,	false,	false,	false,		false)
];

Region.XX = [
	new Region(1,0,	true,	false,	true,	false,	true,	false,		false),
	new Region(2,0,	false,	false,	false,	false,	true,	false,		false),
	new Region(3,0,	false,	false,	false,	false,	true,	false,		false),
	new Region(1,1,	false,	false,	true,	false,	false,	false,		false),
	new Region(2,1,	true,	false,	false,	false,	false,	false,		false),
	new Region(1,2,	true,	false,	false,	false,	false,	false,		false)
];
