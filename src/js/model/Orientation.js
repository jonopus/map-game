module.exports = Orientation;
function Orientation(index, angle){
	this.index = index
	this.angle = angle
}

Orientation.XP = new Orientation(0, 0);
Orientation.YP = new Orientation(1, 60);
Orientation.ZP = new Orientation(2, 120);
Orientation.XM = new Orientation(3, 180);
Orientation.YM = new Orientation(4, 210);
Orientation.ZM = new Orientation(5, 270);


var orientations = [
Orientation.XP,
Orientation.YP,
Orientation.ZP,
Orientation.XM,
Orientation.YM,
Orientation.ZM
]

Orientation.rotate = rotate;
function rotate(point, orientation){
	
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