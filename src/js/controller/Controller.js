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

	$('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this));
	$('body').on('NUB_CLICKED', $.proxy(this.handleNubClicked, this));
	$('body').on('REGION_MOUSEOVER', $.proxy(this.handleRegionMouseover, this));
	$('body').on('REGION_MOUSEOUT', $.proxy(this.handleRegionMouseout, this));
	$('body').on('STAGE_MOUSEMOVE', $.proxy(this.handleStageMouseMove, this));

	/* // All Tiles
	game.addTile(new Tile(Region.O3, -4, -3));
	game.addTile(new Tile(Region.O2, 0, -3));
	game.addTile(new Tile(Region.O1, 4, -3));
	
	game.addTile(new Tile(Region.C3, -6, 1));
	game.addTile(new Tile(Region.C2, -2, 1));
	game.addTile(new Tile(Region.C1, 2, 1));
	*/

	//starting set
	
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

	game.addPlayer(new Player('Red', 'red'));
	game.addPlayer(new Player('Blue', 'blue'));
	game.nextPlayer()

	render(game.getRegions())
}

function render(regions) {



	var nubs = game.getNubs(regions);
	var nubTiles = game.getNubTiles(nubs);

	var tiles = game.getTiles();
	renderer.renderTiles(tiles.concat(nubTiles));
	
	
	renderer.renderRegions(regions.concat(nubs));

	renderer.highlight('capture', nubs);
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