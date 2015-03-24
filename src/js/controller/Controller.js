var Region = require('../model/Region.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var renderer;
var nextRegions = Region.O3;
var nextOrientation = Orientation.XP;


module.exports = Controller;
function Controller(newGame, newRenderer) {
	game = newGame;
	renderer = newRenderer;

	$('body').on('NUB_CLICKED', $.proxy(this.handleNubClicked, this));
	$('body').on('NUB_MOUSEOVER', $.proxy(this.handleNubMouseover, this));
	$('body').on('NUB_MOUSEOUT', $.proxy(this.handleNubMouseout, this));
	$('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this));
	$('body').on('TILE_TYPE_CLICKED', $.proxy(this.handleTileTypeClicked, this));
	$('body').on('ROTATE_CLICKED', $.proxy(this.handleRotateClicked, this));
	$('body').on('REGION_MOUSEOVER', $.proxy(this.handleRegionMouseover, this));
	$('body').on('REGION_MOUSEOUT', $.proxy(this.handleRegionMouseout, this));


	game.addPlayer(new Player('Red', 'red'));
	game.addPlayer(new Player('Blue', 'blue'));
	game.nextPlayer()
	
	game.addTiles(Tile.getStartTiles());
	renderer.renderTileTypes(Tile.getTiles())
	render(game.getRegions())
}

function render(regions) {
	var nubs = game.getNubs(regions);
	var nubTiles = game.getNubTiles(nubs);
	var tiles = game.getTiles().concat(nubTiles);

	renderer.renderTilePreview(getNextTile(0, 0,  Orientation.XP));
	renderer.renderTiles(tiles);
	renderer.renderRegions(regions);
}

function getNextTile(x, y, orientation) {
	return new Tile(nextRegions, x, y, orientation)
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
	var regions = game.getRegions()

	var tile = getNextTile(x, y, o ? Orientation.YP : Orientation.XP);

	var misMatchedRegions = game.getMisMatchedRegions(regions, tile)
	
	if(!misMatchedRegions.length){
		game.addTile(tile);
	}

	render(game.getRegions().concat(misMatchedRegions))
	renderer.highlight('illegal', misMatchedRegions);
}

Controller.prototype.handleNubMouseover = handleNubMouseover;
function handleNubMouseover(event, x, y, o) {
	console.log('handleNubMouseover', x, y, o);
}

Controller.prototype.handleNubMouseout = handleNubMouseout;
function handleNubMouseout(event, x, y, o) {
	console.log('handleNubMouseout', x, y, o);
}

Controller.prototype.handleRotateClicked = handleRotateClicked;
function handleRotateClicked(event, clockwise) {
	nextOrientation = nextOrientation.getAt(clockwise ? -1 : 1)
	renderer.renderTilePreview(getNextTile(0, 0, nextOrientation))
}

Controller.prototype.handleTileTypeClicked = handleTileTypeClicked;
function handleTileTypeClicked(event, tileTypeClicked) {
	nextRegions = Region[tileTypeClicked]

	console.log('nextRegions', tileTypeClicked, nextRegions);

	renderer.renderTilePreview(getNextTile(0, 0, nextOrientation))
}