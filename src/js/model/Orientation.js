module.exports = Orientation;
function Orientation(index, angle, vector){
	this.index = index;
	this.angle = angle;
	this.vector = vector;
}

Orientation.XP = new Orientation(0, 0,		{x:1,	y:0});
Orientation.YP = new Orientation(1, 60,		{x:0,	y:1});
Orientation.ZP = new Orientation(2, 120,	{x:-1,	y:1});
Orientation.XM = new Orientation(3, 180,	{x:-1,	y:0});
Orientation.YM = new Orientation(4, 210,	{x:0,	y:-1});
Orientation.ZM = new Orientation(5, 270,	{x:1,	y:-1});

var orientations = [
	Orientation.XP,
	Orientation.YP,
	Orientation.ZP,
	Orientation.XM,
	Orientation.YM,
	Orientation.ZM
]

Orientation.get = get;
function get(){
	return orientations;
}

Orientation.getOpposite = getOpposite;
function getOpposite(orientation){
	switch(orientation){
		case Orientation.XP: return Orientation.XM;
		case Orientation.YP: return Orientation.YM;
		case Orientation.ZP: return Orientation.ZM;
		case Orientation.XM: return Orientation.XP;
		case Orientation.YM: return Orientation.YP;
		case Orientation.ZM: return Orientation.ZP;
	}
}

Orientation.rotateArray = rotateArray;
function rotateArray(array, delta){
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
		case Orientation.XM:
			_x = -x;
			_y = -y;
			_z = -z;
			break;
		case Orientation.YM:
			_x = y;
			_y = z;
			_z = x;
			break;
		case Orientation.ZM:
			_x = -z;
			_y = -x;
			_z = -y;
			break;
	}

	return {x:_x, y:-_x-_z};
}