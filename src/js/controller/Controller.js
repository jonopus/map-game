var Region = require('../model/Region.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var gameRenderer;

module.exports = Controller;
function Controller(game, renderer) {
	this.game = game;
	gameRenderer = renderer;

	$('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this))

	this.game.addPlayer(new Player('Red', 'red'));
	this.game.addPlayer(new Player('Blue', 'blue'));

	this.game.addTile(new Tile(Region.O3, 0, 0, Orientation.XP));
	this.game.addTile(new Tile(Region.O3, 0, 0, Orientation.YP));
	this.game.addTile(new Tile(Region.O3, 0, 0, Orientation.ZP));
	this.game.addTile(new Tile(Region.O3, 0, 0, Orientation.XM));
	this.game.addTile(new Tile(Region.O3, 0, 0, Orientation.YM));
	this.game.addTile(new Tile(Region.O3, 0, 0, Orientation.ZM));

	/*
	this.game.addTile(new Tile(Region.O3, -4, -3));
	this.game.addTile(new Tile(Region.O2, 0, -3));
	this.game.addTile(new Tile(Region.O1, 4, -3));
	
	this.game.addTile(new Tile(Region.C3, -6, 1));
	this.game.addTile(new Tile(Region.C2, -2, 1));
	this.game.addTile(new Tile(Region.C1, 2, 1));
	*/

	gameRenderer.render(this.game.getRegions());
}

Controller.prototype.handleRegionClicked = handleRegionClicked;
function handleRegionClicked(event, tileId, regionId) {
	var regions = this.game.getRegions();

	var player = this.game.nextPlayer()

	var liberties = this.game.getLiberties(regions, player, tileId, regionId);

	if(liberties.length){
		player.claim(tileId, regionId);
		this.game.applyClaims(regions, player.getClaims());
	}
	
	gameRenderer.render(regions);
	gameRenderer.highlight(liberties);
}