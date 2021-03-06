module.exports = Orientation;
function Orientation(index, angle, vector, offset){
	this.index = index;
	this.angle = angle;
	this.vector = vector;
	this.offset = offset;
}

Orientation.XP = new Orientation(0, 0,		{x:1,	y:0},	{x:0,	y:0});
Orientation.YP = new Orientation(1, 60,		{x:0,	y:1},	{x:0,	y:0});
Orientation.ZP = new Orientation(2, 120,	{x:-1,	y:1},	{x:0,	y:1});
Orientation.XN = new Orientation(3, 180,	{x:-1,	y:0},	{x:-1,	y:1});
Orientation.YN = new Orientation(4, 240,	{x:0,	y:-1},	{x:-1,	y:1});
Orientation.ZN = new Orientation(5, 300,	{x:1,	y:-1},	{x:-1,	y:0});

var orientations = [
	Orientation.XP,
	Orientation.YP,
	Orientation.ZP,
	Orientation.XN,
	Orientation.YN,
	Orientation.ZN
]

Orientation.get = get;
function get(index){
	return orientations[index] || orientations;
}

Orientation.prototype.getAt = getAt;
function getAt(delta){
	return orientations[(orientations.length + this.index + delta)%orientations.length]
}

Orientation.getOpposite = function(orientation){
	switch(orientation){
		case Orientation.XP: return Orientation.XN;
		case Orientation.YP: return Orientation.YN;
		case Orientation.ZP: return Orientation.ZN;
		case Orientation.XN: return Orientation.XP;
		case Orientation.YN: return Orientation.YP;
		case Orientation.ZN: return Orientation.ZP;
	}
}

Orientation.rotateArray = function(array, delta){
	var first = array.slice(0);
	var last = first.splice(-delta, delta);
	return last.concat(first);
}

Orientation.rotatePoint = rotatePoint;
function rotatePoint(point, orientation){
	
	var
	x = point.x,
	y = point.y,
	z = -point.x-point.y;

	var
	_x,
	_y,
	_z;

	switch(orientation){
		case Orientation.XP:
			return point;
			break;
		case Orientation.YP:
			_x = -y;
			_y = -z;
			_z = -x;
			break;
		case Orientation.ZP:
			_x = z;
			_y = x;
			_z = y;
			break;
		case Orientation.XN:
			_x = -x;
			_y = -y;
			_z = -z;
			break;
		case Orientation.YN:
			_x = y;
			_y = z;
			_z = x;
			break;
		case Orientation.ZN:
			_x = -z;
			_y = -x;
			_z = -y;
			break;
	}

	return {x:_x, y:-_x-_z};
}