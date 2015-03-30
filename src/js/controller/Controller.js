var Region = require('../model/Region.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var renderer;
var misMatched;
var nextTileType = 'O3';
var nextOrientation = Orientation.XP;


module.exports = Controller;
function Controller(newGame, newRenderer) {
	game = newGame;
	renderer = newRenderer;

	$('body').on('NUB_CLICKED', $.proxy(this.handleNubClicked, this));
	$('body').on('NUB_MOUSEOVER', $.proxy(this.handleNubMouseover, this));
	$('body').on('NUB_MOUSEOUT', $.proxy(this.handleNubMouseout, this));
	
	$('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this));
	$('body').on('REGION_MOUSEOVER', $.proxy(this.handleRegionMouseover, this));
	$('body').on('REGION_MOUSEOUT', $.proxy(this.handleRegionMouseout, this));
	
	$('body').on('TILE_TYPE_CLICKED', $.proxy(this.handleTileTypeClicked, this));
	$('body').on('ROTATE_CLICKED', $.proxy(this.handleRotateClicked, this));


	game.addPlayer(new Player('Red', 'red'));
	game.addPlayer(new Player('Blue', 'blue'));
	game.addTiles(Tile.getStartTiles());

	game.nextPlayer();	
	renderer.renderTileTypes(Tile.getTiles());
	renderer.setTilePreview('O3');
	
	renderer.renderTiles(game.getTiles(true));
	renderer.renderRegions(game.getRegions(true));
	renderer.renderNubTiles(game.getNubTiles());
}

Controller.prototype.handleNubMouseover = handleNubMouseover;
function handleNubMouseover(event, x, y, o) {
	
	var regions = game.getRegions();

	var nubIsOdd = !!(o%2);
	var nextOrientationIsOdd = !!(nextOrientation.index%2);

	if(nubIsOdd !== nextOrientationIsOdd){
		nextOrientation = nextOrientation.getAt( nubIsOdd ? 1 : -1)
	}

	var tile;
	var tries = 0;
	var orientation = nextOrientation;
	var previewMisMatched;

	while(
		(!tile || !previewMisMatched) ||
		(++tries <= 3 && previewMisMatched.length !== 0)
	){
		tile && (previewMisMatched = game.getMisMatched(regions, tile));

		if(previewMisMatched && previewMisMatched.length){
			orientation = orientation.getAt(2);
		}
		tile = getNextTile(x, y, orientation);
	}

	nextOrientation = orientation;

	game.addPreviewTile(tile);

	renderer.renderTiles(game.getTiles(true));
	renderer.renderRegions(game.getRegions(true));
}

Controller.prototype.handleNubMouseout = handleNubMouseout;
function handleNubMouseout(event, x, y, o) {
	renderer.renderTiles(game.getTiles());
	renderer.renderRegions(game.getRegions());
	renderer.renderNubTiles(game.getNubTiles());
}

function getNextTile(x, y, orientation) {
	return new Tile(Region[nextTileType], x, y, orientation, nextTileType)
}

Controller.prototype.handleTileTypeClicked = handleTileTypeClicked;
function handleTileTypeClicked(event, tileTypeClicked) {
	nextTileType = tileTypeClicked
	renderer.setTilePreview(tileTypeClicked);
	
	var tile = game.getNextTile();
	if(tile){
		tile = getNextTile(tile.x, tile.y, tile.orientation);
		game.addNextTile(tile);
	}

	rotate(0);
}

Controller.prototype.handleNubClicked = handleNubClicked;
function handleNubClicked(event, x, y, o) {
	var regions = game.getRegions();

	var tile = getNextTile(x, y, nextOrientation);
	
	misMatched = game.getMisMatched(regions, tile)

	if(misMatched.length){
		nextOrientation = nextOrientation.getAt(2);
		tile = getNextTile(x, y, nextOrientation);
	}

	game.addNextTile(tile);

	renderer.renderTiles(game.getTiles());
	renderer.renderRegions(game.getRegions());
	renderer.renderNubTiles(game.getNubTiles());
}

Controller.prototype.handleRotateClicked = handleRotateClicked;
function handleRotateClicked(event, clockwise) {
	rotate(2, clockwise);
}

function rotate(delta, clockwise){
	clockwise = clockwise == undefined ? true : clockwise;

	var tile = game.getNextTile();

	if(tile){
		
		var regions = game.getRegions(true);
		var tries = 0;
		var orientation = tile.orientation.getAt(clockwise ? -delta : delta);
		misMatched = undefined;

		tile = getNextTile(tile.x, tile.y, orientation);

		while(
			(!tile || !misMatched) ||
			(++tries <= 3 && misMatched.length !== 0)
		){
			tile && (misMatched = game.getMisMatched(regions, tile));

			if(misMatched && misMatched.length){
				orientation = orientation.getAt(clockwise ? -2 : 2);
			}
			tile = getNextTile(tile.x, tile.y, orientation);
		}

		nextOrientation = orientation;

		game.addNextTile(tile);

		renderer.renderTiles(game.getTiles());
		renderer.renderRegions(game.getRegions());
		renderer.renderNubTiles(game.getNubTiles());
	}
}

Controller.prototype.handleRegionClicked = handleRegionClicked;
function handleRegionClicked(event, tileId, regionId) {

	if(!game.getNextTile()){
		return;
	}

	if(misMatched  && misMatched.length){
		return;
	}

	var regions = game.getRegions();

	var player = game.currentPlayer;
	var region = game.getRegion(regions, tileId, regionId);
	var liberties = game.getLiberties(regions, player, region);
	var captures = game.getCaptures(regions, player, region);

	console.log(liberties.length, captures.length);

	if(!region.claimed && (liberties.length || captures.length)){
		var claim = player.claim(tileId, regionId);
		game.removeClaims(captures);
		game.applyClaims(regions, [claim]);
		game.nextPlayer()
	}
	
	renderer.renderTiles(game.getTiles());
	renderer.renderRegions(game.getRegions());
	renderer.renderNubTiles(game.getNubTiles());
}

Controller.prototype.handleRegionMouseover = handleRegionMouseover;
function handleRegionMouseover(event, tileId, regionId) {

	if(!game.getNextTile()){
		return;
	}

	var regions = game.getRegions();

	var region = game.getRegion(regions, tileId, regionId);

	if(!region || !region.claimable) return;

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

	if(!game.getNextTile()){
		return;
	}

	renderer.highlight('capture', []);
	renderer.highlight('liberty', []);
	renderer.highlight('illegal', []);
	renderer.highlight('preview-claimed', []);
	renderer.highlight('preview-red', []);
	renderer.highlight('preview-blue', []);
}
