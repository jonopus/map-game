var Game = require('../model/Game.js');
var Grid = require('../model/Grid.js');
var Ports = require('../model/Ports.js');
var Renderer = require('../view/Renderer.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var renderer;

var tiles;
var claims;
var player;
var regions;
var nubs;
var tileTypeId = 'O3';
var previewTile = new Tile();

module.exports = Controller;
function Controller() {
	game = new Game();
	renderer = new Renderer();

	game.addTiles(Tile.getStartTiles());

	game.addPlayer(new Player('red'));
	game.addPlayer(new Player('blue'));
	game.nextPlayer();

	renderer.renderTileTypes(Tile.getTileTypes());
	renderer.selectTileType(tileTypeId)
	
	$('body').on('NUB_MOUSEOVER', handleNubMouseover);
	$('body').on('NUB_MOUSEOUT', handleNubMouseout);
	$('body').on('NUB_CLICKED', handleNubClicked);
	$('body').on('TILE_TYPE_CLICKED', handleTileTypeClicked);
	$('body').on('ROTATE_CLICKED', handleRotateClicked);
	$('body').on('MARK_CLICKED', handleRegionClicked);
	
	renderGame();
	renderer.renderNubs(Grid.getNubs(tiles, regions));
}

function renderGame(tile, liberties, captures){
	tiles = game.getTiles().concat(tile ? [tile] : []);
	claims = game.getClaims();
	player = game.getCurrentPlayer();
	regions = Grid.getRegions(tiles);
	
	regions = game.applyClaims(regions, claims);
	renderer.render(tiles);
	renderer.highlight(liberties || [], 'liberties');
	renderer.highlight(captures || [], 'captures');

	$.each(game.getPlayers(), function(i, player) {
		renderer.highlight(player.getClaims(), player.color);
	});

	tile && renderer.selectNub(tile.x, tile.y);
	!tile && renderer.selectNub();
}

function handleNubMouseover(event, x, y, o){
	
	previewTile = new Tile(x, y, Ports[tileTypeId], Orientation.get(o));
	previewTile.orientation = Grid.getValidOrientations(tiles, regions, previewTile)[0] || previewTile.orientation;

	if(previewTile.orientation){
		renderGame();
		renderer.renderPreviewTile(previewTile);
	}
}

function handleNubMouseout(event, x, y, o){
	renderer.removePreviewTile(previewTile);
	
	var tile = game.getNextTile();
	renderGame(tile);
}

function validate(tile){
	if(!tile) return false;

	var misMatches = Grid.getMisMatches(tiles, regions, tile)
	var validOrientations = Grid.getValidOrientations(tiles, regions, tile)
		
	if(misMatches.length === 0 && validOrientations.length){
		return true;
	}else{
		return false;
	}
}

function handleNubClicked(event, x, y, o){
	var tile = previewTile.clone();

	if(validate(tile)){
		game.setNextTile(tile);
		renderGame(tile);
	}else{
		renderer.showError(x, y, Orientation.get(o));
	}

}

function handleTileTypeClicked(event, id){
	renderer.selectTileType(tileTypeId = id)

	var tile = game.getNextTile();
	if(!tile) return;

	tile.ports = Ports[tileTypeId];
	tile.orientation = Grid.getValidOrientations(tiles, regions, tile)[0] || tile.orientation

	if(validate(tile)){
		game.setNextTile(tile);
		renderGame(tile);
	}else{
		renderer.showError(tile.x, tile.y, tile.orientation);
		renderGame(game.getNextTile());
	}
}

function handleRotateClicked(event, id){
	
	var tile = game.getNextTile();
	if(!tile) return;

	tile.orientation = tile.orientation.getAt(2);
	tile.orientation = Grid.getValidOrientations(tiles, regions, tile)[0] || tile.orientation
	
	var validOrientations = Grid.getValidOrientations(tiles, regions, tile);

	if(validOrientations.length > 1){
		game.setNextTile(tile);
		renderGame(tile);
	}else{
		renderer.showError(tile.x, tile.y, tile.orientation);
		renderGame(game.getNextTile());
	}
}

function handleRegionClicked(event, tileId, regionId){
	
	var tile = game.getNextTile();
	
	if(!tile){
		return;
	}

	renderGame(tile, liberties, captures);

	var region = Grid.getRegion(regions, tileId, regionId);
	var liberties = Grid.getLiberties(tiles, regions, region, player.id);
	var captures = Grid.getCaptures(tiles, regions, region, player.id);

	if(liberties.length || captures.length) {
		game.addNextTile();
		previewTile = new Tile();
		game.removeClaims(captures);
		player.addClaim(region);
		claims.push(region);
		
		game.nextPlayer();
		renderer.renderNubs(Grid.getNubs(tiles, regions));
		renderer.renderPreviewTile();
	}else{
		var regionTile = game.getTile(tileId)
		renderer.showError(regionTile.x, regionTile.y, regionTile.orientation);
	}

	renderGame(tile, liberties, captures);
}