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
var previewTile;

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
	$('body').on('ROTATE_CLICKED', handleRotateClicked);
	$('body').on('NUB_MOUSEOVER', handleNubMouseover);
	$('body').on('NUB_MOUSEOUT', handleNubMouseout);
	
	update();

	renderGame();

	renderer.renderTileTypes(Tile.getTileTypes());

	renderer.renderNubs(Grid.getNubs(tiles, regions));
}

function update(tile){
	tiles = game.getTiles().concat(tile ? [tile] : []);
	claims = game.getClaims();
	player = game.getCurrentPlayer();
	regions = Grid.getRegions(tiles);
	regions = game.applyClaims(regions, claims);
}

function renderGame(liberties, captures){
	renderer.render(tiles);
	renderer.highlight(liberties || [], 'liberties');
	renderer.highlight(captures || [], 'captures');

	$.each(game.getPlayers(), function(i, player) {
		renderer.highlight(player.getClaims(), player.color);
	});
}

function handleNubClicked(event, x, y, o){
	console.log('handleNubClicked', x, y);

	var misMatches = Grid.getMisMatches(tiles, regions, previewTile)
	if(misMatches.length === 0){
		renderer.selectNub(x, y);
		game.setNextTile(previewTile);
		update();
		renderGame();
	}
}

function handleTileTypeClicked(event, id){
	tileTypeId = id;

	if(previewTile){
		previewTile.ports = Ports[tileTypeId]
		var validOrientations = Grid.getValidOrientations(tiles, regions, previewTile)
		previewTile.orientation = validOrientations[0] || previewTile.orientation;
		
		if(!validOrientations.length){
			previewTile = null
		}

		renderGame();
		renderer.renderNubs(Grid.getNubs(tiles, regions));
		renderer.renderPreviewTile(previewTile);
	}
}

function handleRotateClicked(event, id){
	if(!previewTile) return;

	previewTile.orientation = previewTile.orientation.getAt(2);
	previewTile.orientation = Grid.getValidOrientations(tiles, regions, previewTile)[0] || previewTile.orientation;
	renderer.renderPreviewTile(previewTile);
}

function handleNubMouseout(event, x, y, o){
	renderer.renderPreviewTile(previewTile = game.getNextTile(), true);
}

function handleNubMouseover(event, x, y, o){
	update();

	var tile = new Tile(x, y, Ports[tileTypeId], Orientation.get(o));
	tile.orientation = Grid.getValidOrientations(tiles, regions, tile)[0] || tile.orientation;
	renderer.renderPreviewTile(previewTile = tile);
}

function handleRegionClicked(event, tileId, regionId){
	console.log('handleRegionClicked');
	update(game.getNextTile());
	
	var region = Grid.getRegion(regions, tileId, regionId);
	var liberties = Grid.getLiberties(tiles, regions, region, player.id);
	var captures = Grid.getCaptures(tiles, regions, region, player.id);

	if(liberties.length || captures.length) {
		game.addNextTile();
		game.removeClaims(captures);
		player.addClaim(region);
		claims.push(region);
		game.nextPlayer();

		renderer.renderNubs(Grid.getNubs(tiles, regions));
	}

	renderGame(liberties, captures);
	
}


