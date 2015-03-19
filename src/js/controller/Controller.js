var Region = require('../model/Region.js');
var Orientation = require('../model/Orientation.js');
var Tile = require('../model/Tile.js');
var Player = require('../model/Player.js');

var game;
var gameRenderer;
var player;

module.exports = Controller;
function Controller(game, renderer) {
	console.log('Controller');

	this.game = game;
	gameRenderer = renderer;

	$('body').on('REGION_CLICKED', $.proxy(this.handleRegionClicked, this))

	player = new Player('A');
	this.game.addPlayer(player);

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
	console.log('handleRegionClicked', tileId, regionId);

	player.claim(tileId, regionId);

	var regions = this.game.getRegions();

	var claims = player.getClaims();
	
	for (var c = claims.length - 1; c >= 0; c--) {
		var claim = claims[c];

		for (var r = regions.length - 1; r >= 0; r--) {
			var region = regions[r];

			if (parseInt(region.tileId) === parseInt(claim.tileId) && parseInt(region.id) === parseInt(claim.regionId)) {
				region.claim = player.id
			}
		};
	};
	
	gameRenderer.render(regions);


	var liberties = this.game.getLiberties(tileId, regionId)
	console.log('liberties', liberties);
	
	gameRenderer.highlight(liberties);
}