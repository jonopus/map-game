module.exports = Game;
function Game() {
	this.tiles = [];
	this.players = [];
}

Game.prototype.addPlayer = addPlayer;
function addPlayer(player){
	this.players.push(player);
}

Game.prototype.nextPlayer = nextPlayer;
function nextPlayer(){

	var index = this.players.indexOf(this.currentPlayer) +1;
	if(index >= 0 && index < this.players.length){
		return this.currentPlayer = this.players[index]
	}else{
		return this.currentPlayer = this.players[0]
	}
}

Game.prototype.addTile = addTile;
function addTile(tile){
	this.tiles.push(tile);
}

Game.prototype.getTile = getTile;
function getTile(tileId){
	return $.grep(this.tiles, function(tile, i){
		return tile.id === parseInt(tileId)
	})[0];
}var Orientation = require('./Orientation.js');

Game.prototype.getRegions = getRegions;
function getRegions(){

	var regions = [];

	for (var i = this.tiles.length - 1; i >= 0; i--) {
		var tile = this.tiles[i];
		regions = regions.concat(tile.getRegions());
	};

	var claims = [];

	for (var i = this.players.length - 1; i >= 0; i--) {
		var player = this.players[i]
		claims = claims.concat(player.getClaims());
	};

	applyClaims(regions, claims);

	return regions;
}

Game.prototype.applyClaims = applyClaims;
function applyClaims(regions, claims){
	
	for (var c = claims.length - 1; c >= 0; c--) {
		var claim = claims[c];

		for (var r = regions.length - 1; r >= 0; r--) {
			var region = regions[r];

			if (parseInt(region.tileId) === parseInt(claim.tileId) && parseInt(region.id) === parseInt(claim.regionId)) {
				region.claimed = claim;
			}
		};
	};
}

Game.prototype.getLiberties = getLiberties;
function getLiberties(regions, player, tileId, regionId){
	var region = $.grep(regions, function(region){
		return parseInt(region.tileId) === parseInt(tileId) && parseInt(region.id) === parseInt(regionId);
	})[0];

	if(!region.claimable) return false;

	return getNeighbor(regions, player, region);
}

function getNeighbor(regions, player, region, startRegion, fromOrientation){
	console.log('getNeighbor');

	var liberties = [];

	var orientations = region.getOrientations(0);

	for (var i = orientations.length - 1; i >= 0; i--) {

		var orientation = orientations[i];

		if(fromOrientation === Orientation.getOpposite(orientation)){
			continue;
		}

		var vector = {
			x:region.x + orientation.vector.x,
			y:region.y + orientation.vector.y
		};

		var neighbor = getRegionAt(regions, vector)

		if(!neighbor){
			continue;
		}

		neighbor.mapped = true;


		if(neighbor.claimable){
			if(!neighbor.claimed){
				liberties.push(neighbor);
			}else{
				if(neighbor.claimed.player && neighbor.claimed.player === player){
					liberties = liberties.concat(getNeighbor(regions, player, neighbor, startRegion, orientation));
				}else if(neighbor.claimed.player && neighbor.claimed.player !== player){

					console.log('enimieLiberties', getNeighbor(regions, neighbor.claimed.player, neighbor, neighbor).length);
				}
			}
		}else{
			liberties = liberties.concat(getNeighbor(regions, player, neighbor, startRegion, orientation));
		}
		
	};

	return liberties;
}

function getRegionAt(regions, vector){
	return $.grep(regions, function(region){
		return region.x === vector.x && region.y === vector.y;
	})[0];
}