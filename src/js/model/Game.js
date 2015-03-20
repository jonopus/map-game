var Orientation = require('./Orientation.js');


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
}

Game.prototype.getTiles = getTiles;
function getTiles(){
	return this.tiles;
}

Game.prototype.getRegions = getRegions;
function getRegions(){

	var regions = [];

	for (var i = this.tiles.length - 1; i >= 0; i--) {
		var tile = this.tiles[i];
		regions = regions.concat(tile.getRegions());
	};

	applyClaims(regions, this.getClaims());

	return regions;
}

Game.prototype.getRegionAt = getRegionAt;
function getRegionAt(regions, vector){
	return $.grep(regions, function(region){
		return region.x === vector.x && region.y === vector.y;
	})[0];
}

Game.prototype.getClaims = getClaims;
function getClaims(){
	var claims = [];

	for (var i = this.players.length - 1; i >= 0; i--) {
		var player = this.players[i]
		claims = claims.concat(player.getClaims());
	};

	return claims
}

Game.prototype.removeClaims = removeClaims;
function removeClaims(captures){
	for (var i = 0; i < captures.length; i++) {
		var region = captures[i];
		var claim = region.claimed;
		claim.player.removeClaim(claim.tileId, claim.regionId)
		region.claimed = null;
	};
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

Game.prototype.getRegion = getRegion;
function getRegion(regions, tileId, regionId){
	return $.grep(regions, function(region){
		return parseInt(region.tileId) === parseInt(tileId) && parseInt(region.id) === parseInt(regionId);
	})[0];
}

Game.prototype.getNeighbors = getNeighbors;
function getNeighbors(regions, region, excludeOrientation, loggedRegions){

	var neighbors = [];

	if(!loggedRegions){
		loggedRegions = [];
	}

	if(loggedRegions.indexOf(region) >= 0){
		return neighbors;
	}

	loggedRegions.push(region);

	var orientations = region.getOrientations(0);

	for (var i = orientations.length - 1; i >= 0; i--) {

		var orientation = orientations[i];

		if(Orientation.getOpposite(orientation) === excludeOrientation){
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

		if(neighbor.claimable){
			neighbors.push(neighbor);
		}else{
			neighbors = neighbors.concat(getNeighbors(regions, neighbor, orientation, loggedRegions));
		}
	};

	return neighbors;
}

Game.prototype.getCaptures = getCaptures;
function getCaptures(regions, player, region){

	var captures = [];

	if(region.claimed) return captures;

	var neighbors = this.getNeighbors(regions, region);

	for (var i = neighbors.length - 1; i >= 0; i--) {
		var neighbor = neighbors[i];


		if(neighbor.claimed && neighbor.claimed.player != player){


			var liberties = this.getLiberties(regions, neighbor.claimed.player, neighbor);

			if(liberties.length === 1){
				captures = captures.concat(this.getGroup(regions, neighbor.claimed.player, neighbor));
			}
		}
	};

	return captures;
}

Game.prototype.getLiberties = getLiberties;
function getLiberties(regions, player, region, startRegion, loggedRegions){

	if(!startRegion){
		startRegion = region
	}

	var liberties = [];

	if(!loggedRegions){
		loggedRegions = [];
	}

	if(loggedRegions.indexOf(region) >= 0){
		return liberties;
	}

	loggedRegions.push(region);

	var neighbors = getNeighbors(regions, region);

	for (var i = neighbors.length - 1; i >= 0; i--) {
		
		var neighbor = neighbors[i];

		if(neighbor === startRegion){
			continue;
		}

		if(neighbor.claimed){
			if(neighbor.claimed.player && neighbor.claimed.player === player){
				liberties = liberties.concat(getLiberties(regions, player, neighbor, startRegion, loggedRegions));
			}
		}else{
			if(neighbor.claimable){
				liberties.push(neighbor);
			}else{
				liberties = liberties.concat(getLiberties(regions, player, neighbor, startRegion, loggedRegions));
			}
		}
	};

	return liberties;
}


Game.prototype.getGroup = getGroup;
function getGroup(regions, player, region, startRegion, loggedRegions){

	if(!startRegion){
		startRegion = region
	}

	var group = [];

	if(!loggedRegions){
		loggedRegions = [];
	}

	if(loggedRegions.indexOf(region) >= 0){
		return group;
	}

	loggedRegions.push(region);

	var neighbors = getNeighbors(regions, region);

	for (var i = neighbors.length - 1; i >= 0; i--) {
		
		var neighbor = neighbors[i];

		if(neighbor === startRegion){
			continue;
		}

		if(neighbor.claimed){
			if(neighbor.claimed.player && neighbor.claimed.player === player){
				group = group.concat(getGroup(regions, player, neighbor, startRegion, loggedRegions));
			}
		}

	};

	group.push(region);

	return group;
}