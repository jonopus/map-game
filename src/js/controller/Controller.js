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
	render(game.getRegions(), game.getTiles())
	renderNubs();
}

function renderNubs() {
	var nubs = game.getNubs(game.getRegions());
	var nubTiles = game.getNubTiles(nubs);
	renderer.renderNubTiles(nubTiles);
}

function render(regions, tiles, nextTile) {

	if(nextTile){

		regions = regions.concat(nextTile.getRegions())
		tiles = tiles.concat(nextTile)
	}

	renderer.setTilePreview(getNextTile(0, 0, nextOrientation));
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
	
	render(regions, game.getTiles())
}

Controller.prototype.handleRegionMouseover = handleRegionMouseover;
function handleRegionMouseover(event, tileId, regionId) {
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
	renderer.highlight('capture', []);
	renderer.highlight('liberty', []);
	renderer.highlight('illegal', []);
	renderer.highlight('preview-claimed', []);
	renderer.highlight('preview-red', []);
	renderer.highlight('preview-blue', []);
}

Controller.prototype.handleNubClicked = handleNubClicked;
function handleNubClicked(event, x, y, o) {
	var regions = game.getRegions();

	var tile = getNextTile(x, y, nextOrientation);
	var tileRegions = $.grep(tile.getRegions(), function(region){
		return region.traversable;
	});
	var misMatched = game.getMisMatched(regions, tileRegions)

	if(misMatched.length){
		nextOrientation = nextOrientation.getAt(2);
		tile = getNextTile(x, y, nextOrientation);

		render(
			game.getRegions(),
			game.getTiles(),
			tile
		)
	}else{
		game.addTile(tile);
		renderNubs()

		render(
			game.getRegions(),
			game.getTiles()
		)
	}
}

Controller.prototype.handleNubMouseover = handleNubMouseover;
function handleNubMouseover(event, x, y, o) {
	var nubIsOdd = !!(o%2);
	var nextOrientationIsOdd = !!(nextOrientation.index%2);

	if(nubIsOdd !== nextOrientationIsOdd){
		nextOrientation = nextOrientation.getAt( nubIsOdd ? 1 : -1)
	}

	render(
		game.getRegions(),
		game.getTiles(),
		getNextTile(x, y, nextOrientation)
	)
}

Controller.prototype.handleNubMouseout = handleNubMouseout;
function handleNubMouseout(event, x, y, o) {
	render(
		game.getRegions(),
		game.getTiles()
	)
}

Controller.prototype.handleRotateClicked = handleRotateClicked;
function handleRotateClicked(event, clockwise) {
	nextOrientation = nextOrientation.getAt(clockwise ? -2 : 2)
	renderer.setTilePreview(getNextTile(0, 0, nextOrientation))
}

Controller.prototype.handleTileTypeClicked = handleTileTypeClicked;
function handleTileTypeClicked(event, tileTypeClicked) {
	nextRegions = Region[tileTypeClicked]

	renderer.setTilePreview(getNextTile(0, 0, nextOrientation), tileTypeClicked)
}