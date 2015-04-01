var Game = require('../model/Game.js');
var Grid = require('../model/Grid.js');
var Ports = require('../model/Ports.js');
var Renderer = require('../view/Renderer.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var renderer;

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

	renderer.render(game);

	$('body').on('MARK_CLICKED', handleRegionClicked);
	$('body').on('NUB_CLICKED', handleNubClicked);
}

function handleNubClicked(event, x, y, o){
	console.log('x, y', x, y, o);

	game.addTile(new Tile(x, y, Ports.O3, Orientation.get(o)));
	
	var tiles = game.getTiles();
	var claims = game.getClaims();
	var player = game.getCurrentPlayer();
	var regions = Grid.getRegions(tiles);
	regions = game.applyClaims(regions, claims);
	
	var nubs = Grid.getNubs(tiles, regions);
	renderer.renderNubs(nubs);
	renderer.render(game);
	renderer.highlight([], 'liberties');
	renderer.highlight([], 'captures');

	$.each(game.getPlayers(), function(i, player) {
		renderer.highlight(player.getClaims(), player.color);
	})
}

function handleRegionClicked(event, tileId, regionId){
	var tiles = game.getTiles();
	var claims = game.getClaims();
	var player = game.getCurrentPlayer();
	var regions = Grid.getRegions(tiles);
	regions = game.applyClaims(regions, claims);
	var region = Grid.getRegion(regions, tileId, regionId);
	
	
	var liberties = Grid.getLiberties(tiles, regions, region, player.id);
	var captures = Grid.getCaptures(tiles, regions, region, player.id);

	if(liberties.length || captures.length) {
		game.removeClaims(captures);
		player.addClaim(region);
		claims.push(region);
		game.nextPlayer()
	}

	var nubs = Grid.getNubs(tiles, regions);
	renderer.renderNubs(nubs);
	renderer.render(game);
	renderer.highlight(liberties, 'liberties');
	renderer.highlight(captures, 'captures');

	$.each(game.getPlayers(), function(i, player) {
		renderer.highlight(player.getClaims(), player.color);
	})
	
}
