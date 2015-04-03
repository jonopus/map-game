var Orientation = require('./Orientation.js');
var Tile = require('./Tile.js');

var nextTile;

module.exports = Game;
function Game() {
	this.tiles = [];
	this.players = [];
	this.claims = [];
}

Game.prototype.setNextTile = function(tile){
	nextTile = tile
}

Game.prototype.getNextTile = function(){
	return nextTile;
}

Game.prototype.addNextTile = function(){
	this.addTile(nextTile);
	nextTile = null;
}

Game.prototype.addTile = function(tile){
	if(this.tiles.indexOf(tile) < 0){
		this.tiles.push(tile);
	}
}

Game.prototype.getTiles = function(usePreview){
	return this.tiles.concat(nextTile && usePreview ? [nextTile] : []);
}

Game.prototype.addPlayer = function(player){
	this.players.push(player);
}

Game.prototype.getPlayers = function(){
	return this.players;
}

Game.prototype.getPlayer = function(id){
	return $.grep(this.players, function(player){
		return player.id === id
	})[0];
}

Game.prototype.getCurrentPlayer = function(){
	return this.currentPlayer;
}

Game.prototype.nextPlayer = function(){

	var index = this.players.indexOf(this.currentPlayer) +1;
	if(index >= 0 && index < this.players.length){
		return this.currentPlayer = this.players[index]
	}else{
		return this.currentPlayer = this.players[0]
	}
}

Game.prototype.getClaims = function(){
	var claims = [];

	for (var i = this.players.length - 1; i >= 0; i--) {
		var player = this.players[i]
		claims = claims.concat(player.getClaims());
	};

	return claims;
}

Game.prototype.applyClaims = function(regions, claims){
	return $.map(regions, function(region){
		return $.grep(claims, function(claim){
			return claim.tileId === region.tileId && claim.regionId === region.regionId;
		})[0] || region;
	});
}

Game.prototype.removeClaims = function(captures){
	for (var i = 0; i < captures.length; i++) {
		var region = captures[i];
		var player = this.getPlayer(region.playerId);

		player && player.removeClaim(region.tileId, region.regionId);
	};
}
