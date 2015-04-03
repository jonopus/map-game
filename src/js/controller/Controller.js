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
var tile;

module.exports = Controller;
function Controller() {
	game = new Game();
	renderer = new Renderer();

	game.addTile(new Tile(1, 0, Ports.O3, Orientation.XP));
	game.addTile(new Tile(0, 1, Ports.O2, Orientation.XN));
	game.addTile(new Tile(-1, 1, Ports.O1, Orientation.ZP));
	game.addTile(new Tile(-1, 0, Ports.C3, Orientation.XN));
	game.addTile(new Tile(0, -1, Ports.C2, Orientation.YN));
	game.addTile(new Tile(1, -1, Ports.C1, Orientation.XN));

	game.addPlayer(new Player('red'));
	game.addPlayer(new Player('blue'));
	game.nextPlayer();

	$('body').on('MARK_CLICKED', handleRegionClicked);
	$('body').on('NUB_CLICKED', handleNubClicked);
	$('body').on('TILE_TYPE_CLICKED', handleTileTypeClicked);
	$('body').on('NUB_MOUSEOVER', handleNubMouseover);
	$('body').on('NUB_MOUSEOUT', handleNubMouseout);
	
	update();

	renderGame();

	renderer.renderTileTypes(Tile.getTileTypes());

}

function update(){
	tiles = game.getTiles();
	claims = game.getClaims();
	player = game.getCurrentPlayer();
	regions = Grid.getRegions(tiles);
	regions = game.applyClaims(regions, claims);
}

function renderGame(liberties, captures){

	var nubs = Grid.getNubs(tiles, regions);
	renderer.renderNubs(nubs);

	renderer.render(game);
	renderer.highlight(liberties || [], 'liberties');
	renderer.highlight(captures || [], 'captures');

	$.each(game.getPlayers(), function(i, player) {
		renderer.highlight(player.getClaims(), player.color);
	})
}

function handleNubClicked(event, x, y, o){
	game.addTile(new Tile(x, y, Ports.O3, Orientation.get(o)));
	update();
	renderGame();
}

function handleTileTypeClicked(event, id){
	tileTypeId = id
}

function handleNubMouseout(event, x, y, o){
	renderer.renderPreviewTile();
}

function handleNubMouseover(event, x, y, o){
	update();

	var tile;
	var tries = 0;
	var orientation = Orientation.get(o);
	var previewMisMatches;

	while(
		(!tile || !previewMisMatches) ||
		(++tries <= 3 && previewMisMatches.length !== 0)
	){
		tile && (previewMisMatches = Grid.getMisMatches(tiles, regions, tile));

		if(previewMisMatches && previewMisMatches.length){
			orientation = orientation.getAt(2);
		}

		console.log(previewMisMatches);
		tile = new Tile(x, y, Ports[tileTypeId], orientation);
	}

	tile && renderer.renderPreviewTile(tile);
}

function handleRegionClicked(event, tileId, regionId){
	update();
	
	var region = Grid.getRegion(regions, tileId, regionId);
	var liberties = Grid.getLiberties(tiles, regions, region, player.id);
	var captures = Grid.getCaptures(tiles, regions, region, player.id);

	if(liberties.length || captures.length) {
		game.removeClaims(captures);
		player.addClaim(region);
		claims.push(region);
		game.nextPlayer();
	}

	renderGame(liberties, captures);
	
}


