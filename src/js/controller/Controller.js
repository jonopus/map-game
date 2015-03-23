var Region = require('../model/Region.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var renderer;

module.exports = Controller;
function Controller(newGame, newRenderer) {
	game = newGame;
	renderer = newRenderer;

	// $('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this));
	// $('body').on('NUB_CLICKED', $.proxy(this.handleNubClicked, this));
	// $('body').on('REGION_MOUSEOVER', $.proxy(this.handleRegionMouseover, this));
	// $('body').on('REGION_MOUSEOUT', $.proxy(this.handleRegionMouseout, this));
	// $('body').on('STAGE_MOUSEMOVE', $.proxy(this.handleStageMouseMove, this));

	/* // All Tiles
	game.addTile(new Tile(Region.O3, -4, -3));
	game.addTile(new Tile(Region.O2, 0, -3));
	game.addTile(new Tile(Region.O1, 4, -3));
	
	game.addTile(new Tile(Region.C3, -6, 1));
	game.addTile(new Tile(Region.C2, -2, 1));
	game.addTile(new Tile(Region.C1, 2, 1));
	*/

	//starting set
	
	/*
	game.addTile(new Tile(Region.O3, -1, -1, Orientation.YP));
	game.addTile(new Tile(Region.O3, -1, 0));
	game.addTile(new Tile(Region.O3, -1, 0, Orientation.YP));
	game.addTile(new Tile(Region.O3, 0, -1));
	game.addTile(new Tile(Region.O3, 0, -1, Orientation.YP));
	game.addTile(new Tile(Region.O3, 0, 0));
	
	game.addTile(new Tile(Region.O2, 0, 0, Orientation.YP));
	game.addTile(new Tile(Region.O1, 1, 0));
	
	game.addTile(new Tile(Region.C2, 1, 1, Orientation.ZP));
	game.addTile(new Tile(Region.C3, 1, 0, Orientation.YP));
	game.addTile(new Tile(Region.C1, 0, 1, Orientation.YP));
	

	game.addTile(new Tile(Region.O3, 0, -2, Orientation.YP));
	game.addTile(new Tile(Region.O3, 0, -2));


	game.addPlayer(new Player('Red', 'red'));
	game.addPlayer(new Player('Blue', 'blue'));
	game.nextPlayer()
	*/

	//render(game.getRegions())

	game.addTile(new Tile(Region.O3, 0, 0));
	game.addTile(new Tile(Region.O3, 0, 1));
	game.addTile(new Tile(Region.O3, 0, 2));
	game.addTile(new Tile(Region.O3, 0, 3));
	game.addTile(new Tile(Region.O3, 0, 4));
	game.addTile(new Tile(Region.O3, 0, 5));
	game.addTile(new Tile(Region.O3, 0, 6));
	game.addTile(new Tile(Region.O3, 1, 0));
	game.addTile(new Tile(Region.O3, 1, 1));
	game.addTile(new Tile(Region.O3, 1, 2));
	game.addTile(new Tile(Region.O3, 1, 3));
	game.addTile(new Tile(Region.O3, 1, 4));
	game.addTile(new Tile(Region.O3, 1, 5));
	game.addTile(new Tile(Region.O3, 1, 6));
	game.addTile(new Tile(Region.O3, 2, 0));
	game.addTile(new Tile(Region.O3, 2, 1));
	game.addTile(new Tile(Region.O3, 2, 2));
	game.addTile(new Tile(Region.O3, 2, 3));
	game.addTile(new Tile(Region.O3, 2, 4));
	game.addTile(new Tile(Region.O3, 2, 5));
	game.addTile(new Tile(Region.O3, 2, 6));
	game.addTile(new Tile(Region.O3, 3, 0));
	game.addTile(new Tile(Region.O3, 3, 1));
	game.addTile(new Tile(Region.O3, 3, 2));
	game.addTile(new Tile(Region.O3, 3, 3));
	game.addTile(new Tile(Region.O3, 3, 4));
	game.addTile(new Tile(Region.O3, 3, 5));
	game.addTile(new Tile(Region.O3, 3, 6));
	game.addTile(new Tile(Region.O3, 4, 0));
	game.addTile(new Tile(Region.O3, 4, 1));
	game.addTile(new Tile(Region.O3, 4, 2));
	game.addTile(new Tile(Region.O3, 4, 3));
	game.addTile(new Tile(Region.O3, 4, 4));
	game.addTile(new Tile(Region.O3, 4, 5));
	game.addTile(new Tile(Region.O3, 4, 6));
	game.addTile(new Tile(Region.O3, 5, 0));
	game.addTile(new Tile(Region.O3, 5, 1));
	game.addTile(new Tile(Region.O3, 5, 2));
	game.addTile(new Tile(Region.O3, 5, 3));
	game.addTile(new Tile(Region.O3, 5, 4));
	game.addTile(new Tile(Region.O3, 5, 5));
	game.addTile(new Tile(Region.O3, 5, 6));

	function rotatePoint(point, angle, origin) {

		origin = origin || {x:0,y:0}

		angle = angle * Math.PI / 180.0;
		return {
			x: Math.cos(angle) * (point.x-origin.x) - Math.sin(angle) * (point.y-origin.y) + origin.x,
			y: Math.sin(angle) * (point.x-origin.x) + Math.cos(angle) * (point.y-origin.y) + origin.y
		};
	}

	var d2 = Math.sqrt(3);
	var a = d2*3.5
	var o = 1.5
	var h = Math.sqrt((a*a) + (o*o));
	var rotate = 90 + Math.atan(a/-o) * (180/Math.PI);

	var scale = h/(d2*4)

	var regions = []
	var odd = []

	for (var x = -5; x < 30; x++) {
	
		for (var y = -10; y < 20; y++) {
			
			var region = new Region(x, y)

			offsetX = (x-1)/4
			offsetY = y/3

			_x = ( (x)				-1		)/4
			_y = ((offsetX)/3) + (y)/3

			_x = Math.floor(_x)
			_y = Math.floor(_y)

			row = _y
			col = 0

			_x = ( (x)				-1	-row	)/4
			_y = ((offsetX)/3) + (y/3)
			
			_x = Math.floor(_x)
			_y = Math.floor(_y)

			var shiftGroupX = ((x-_y)-1)%4

			if(
				(
					(
						_x === 0 ||
						_x === 1
					)
					// &&
					// (
					// 	_y === 0 ||
					// 	_y === 1 ||
					// 	_y === 2 ||
					// 	_y === 3
					// )
				) && (
					(4 -shiftGroupX) <= ((_y)%4)
				)
			) {
				console.log(
					_x,
					_y,
					shiftGroupX
				);

				// _y = ((offsetX)/3) + (y/3) - (1/3)
				// _y = Math.floor(_y)
				region.highlight = true

			}else{
			}
			
			//region.highlight = _y%2
			regions.push(region)

			
			
			
			grid = (
				_x
				+
				_y
			)%2;


			if(grid){
				odd.push(region)
			}
		};
	};
	
	var tiles = game.getTiles();
	renderer.renderTiles(tiles);
	renderer.renderRegions(regions);
	renderer.highlight('liberty', odd);
}

function render(regions) {
	var tiles = game.getTiles();
	
	
	//* // Test
	var nub = new Region(0,1);
	var test = [nub]
	var nubTiles = game.getNubTiles(test);

	regions = regions.concat(test);
	tiles = tiles.concat(nubTiles)
	//*/


	/* // Default
	var nubs = game.getNubs(regions);
	var nubTiles = game.getNubTiles(nubs);

	var tiles = game.getTiles();
	renderer.renderTiles(tiles.concat(nubTiles));
	renderer.renderRegions(regions.concat(nubs));
	renderer.highlight('capture', nubs);
	//*/
	
	
	//var point = Tile.getTileSpace(region);

	/* //Show Ends
	var tiles = game.getTiles();
	var ends = game.getEnds(regions);
	renderer.renderTiles(tiles);
	renderer.renderRegions(regions);
	renderer.highlight('capture', ends);
	//*/

	
	renderer.renderTiles(tiles);
	renderer.renderRegions(regions);

	renderer.highlight('liberty', test);
}

Controller.prototype.handleRegionMouseover = handleRegionMouseover;
function handleRegionMouseover(event, tileId, regionId) {
	var regions = game.getRegions();

	var region = game.getRegion(regions, tileId, regionId);

	if(!region.claimable) return;

	var player = game.currentPlayer;
	var liberties = game.getLiberties(regions, player, region);
	var captures = game.getCaptures(regions, player, region);

	if(region && !region.claimed){
		renderer.highlight('capture', captures);
		renderer.highlight('liberty', liberties);
	}else{
		renderer.highlight('capture', []);
		renderer.highlight('liberty', []);
	}

	if(region.claimed || (!liberties.length && !captures.length)){
		renderer.highlight('illegal', [region]);
	}else{
		renderer.highlight('preview-claimed', [region]);
		renderer.highlight('preview-' + player.color, [region]);
	}
}

Controller.prototype.handleRegionMouseout = handleRegionMouseout;
function handleRegionMouseout(event, tileId, regionId) {
	renderer.highlight('capture', []);
	renderer.highlight('liberty', []);
	renderer.highlight('illegal', []);
	renderer.highlight('preview-claimed', []);
	renderer.highlight('preview-red', []);
	renderer.highlight('preview-blue', []);
}

Controller.prototype.handleNubClicked = handleNubClicked;
function handleNubClicked(event, x, y, o) {
	game.addTile(new Tile(Region.O3, x, y, o ? Orientation.YP : Orientation.XP));

	render(game.getRegions())
}

Controller.prototype.handleRegionClicked = handleRegionClicked;
function handleRegionClicked(event, tileId, regionId) {
	var regions = game.getRegions();

	var player = game.currentPlayer;
	var region = game.getRegion(regions, tileId, regionId);
	var liberties = game.getLiberties(regions, player, region);
	var liberties = game.getLiberties(regions, player, region);
	var captures = game.getCaptures(regions, player, region);

	if(!region.claimed && (liberties.length || captures.length)){
		var claim = player.claim(tileId, regionId);
		game.removeClaims(captures);
		game.applyClaims(regions, [claim]);
		game.nextPlayer()
	}
	
	render(regions)
}

var d2 = Math.sqrt(3);

Controller.prototype.handleStageMouseMove = handleStageMouseMove;
function handleStageMouseMove(event, x, y) {


	
	/*
	var _x = Math.round(x/4);
	var _y = Math.round(y/3);

	x = _x;
	y = _y;

	var regions = game.getRegions();

	regions = regions.concat(new Tile(Region.O3, x, y).getRegions());
	renderer.render(regions);
	*/
}