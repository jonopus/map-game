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

	$('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this))
	$('body').on('REGION_MOUSEOVER', $.proxy(this.handleRegionMouseover, this))
	$('body').on('REGION_MOUSEOUT', $.proxy(this.handleRegionMouseout, this))

	//game.addTile(new Tile(Region.O3, 0, 0, Orientation.XP));
	game.addTile(new Tile(Region.O3, 0, 0, Orientation.YP));
	game.addTile(new Tile(Region.O3, 0, 0, Orientation.ZP));
	game.addTile(new Tile(Region.O3, 0, 0, Orientation.XM));
	game.addTile(new Tile(Region.O3, 0, 0, Orientation.YM));
	game.addTile(new Tile(Region.O3, 0, 0, Orientation.ZM));
	game.addTile(new Tile(Region.O3, 0, 0, Orientation.XP));
	
	game.addTile(new Tile(Region.O2, 7, -5, Orientation.ZP));
	game.addTile(new Tile(Region.C3, 7, -5, Orientation.YP));
	game.addTile(new Tile(Region.C2, -1, -3, Orientation.ZP));

	game.addTile(new Tile(Region.C1, 5, 2, Orientation.XM));

	game.addTile(new Tile(Region.O1, 5, 2, Orientation.ZP));
	game.addTile(new Tile(Region.O1, 2, 6, Orientation.ZM));
	game.addTile(new Tile(Region.O1, 6, 5, Orientation.ZP));
	

	game.addPlayer(new Player('Red', 'red'));
	game.addPlayer(new Player('Blue', 'blue'));
	game.nextPlayer()

	/*
	game.addTile(new Tile(Region.O3, 4, -1, Orientation.YP));
	game.addTile(new Tile(Region.O3, 4, -1, Orientation.XP));
	game.addTile(new Tile(Region.O3, 4, -1, Orientation.ZM));
	game.addTile(new Tile(Region.O3, 4, -1, Orientation.YM));
	game.addTile(new Tile(Region.O3, -3, 4, Orientation.XP));
	game.addTile(new Tile(Region.O3, 1, 3, Orientation.YP));
	game.addTile(new Tile(Region.O3, 1, 3, Orientation.XP));
	game.addTile(new Tile(Region.O3, -4, -3));
	game.addTile(new Tile(Region.O2, 0, -3));
	game.addTile(new Tile(Region.O1, 4, -3));
	
	game.addTile(new Tile(Region.C3, -6, 1));
	game.addTile(new Tile(Region.C2, -2, 1));
	game.addTile(new Tile(Region.C1, 2, 1));
	*/

	renderer.render(game.getRegions());
}

Controller.prototype.handleRegionMouseover = handleRegionMouseover;
function handleRegionMouseover(event, tileId, regionId) {
	var regions = game.getRegions();

	var region = game.getRegion(regions, tileId, regionId);

	if(!region.claimable) return;

	var player = game.currentPlayer;
	var liberties = game.getLiberties(regions, player, region);
	var captures = game.getCaptures(regions, player, region);

	if(!region.claimed){
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

Controller.prototype.handleRegionClicked = handleRegionClicked;
function handleRegionClicked(event, tileId, regionId) {
	var regions = game.getRegions();

	var player = game.currentPlayer;
	var region = game.getRegion(regions, tileId, regionId);
	var liberties = game.getLiberties(regions, player, region);
	var captures = game.getCaptures(regions, player, region);

	if(!region.claimed && (liberties.length || captures.length)){
		var claim = player.claim(tileId, regionId);
		game.removeClaims(captures);
		game.applyClaims(regions, [claim]);
		game.nextPlayer()
	}
	
	renderer.render(regions);
	renderer.highlight('highlight', liberties);
}