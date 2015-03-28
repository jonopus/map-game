var Orientation = require('./Orientation.js');
var Region = require('./Region.js');
var Tile = require('./Tile.js');

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

Game.prototype.addTiles = addTiles;
function addTiles(tiles){
	this.tiles = this.tiles.concat(tiles);
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
function getRegions(useNubs){

	var regions = [];

	for (var i = this.tiles.length - 1; i >= 0; i--) {
		var tile = this.tiles[i];

		var tileRegions = tile.getRegions(useNubs)

		regions = regions.concat(tileRegions);
	};

	if(!useNubs){
		applyClaims(regions, this.getClaims());
	}

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


Game.prototype.getNubTiles = getNubTiles;
function getNubTiles(regions){

	var nubs = [];
	
	$.each(regions, function(i, region){


		var point = Tile.getTileSpace(region);

		var matches = $.grep(nubs, function(item){
			return item.x === point.x && item.y === point.y && item.o === point.o
		});

		if(matches.length){
			return;
		}

		nubs.push(point)

	});

	return $.map(nubs, function(item){
		var tile = new Tile(Region.XX, item.x, item.y, item.o ? Orientation.YP : Orientation.XP);
		tile.isNub = true;

		return tile;
	});
}


Game.prototype.getTraversable = getTraversable;
function getTraversable(regions){

	return $.grep(regions, function(region){
		return region.traversable;
	});
}

/*
Game.prototype.getEnds = getEnds;
function getEnds(regions){

	regions = $.grep(regions, function(region){
		return region.traversable;
	});

	var ends = [];

	search(regions, function(region, vector, lastRegion){
		if(region){
			return true;
		}else{
			var endVector = {
				x:vector.x - vector.o.vector.x,
				y:vector.y - vector.o.vector.y
			}

			var end = getRegionAt(regions, endVector);

			ends.push(end);
			return false;
		}
	}, traverse, regions[0]);

	return ends;
}
*/

function traverse(regions, region, vector, lastRegion, callback) {
	var orientations = region.getOrientations(0);

	for (var i = orientations.length - 1; i >= 0; i--) {

		var orientation = orientations[i];

		if(vector && vector.o === Orientation.getOpposite(orientation)){
			continue;
		}

		var newVector = {
			x:region.x + orientation.vector.x,
			y:region.y + orientation.vector.y,
			o: orientation
		};

		var neighbor = getRegionAt(regions, newVector)

		callback(neighbor, newVector);
	};
}

Game.prototype.getMisMatched = getMisMatched;
function getMisMatched(gameRegions, tileRegions){

	var allRegions = gameRegions.concat(tileRegions);

	var misMatched = [];

	function filter(region, vector, lastRegion){
		return tileRegions.indexOf(region) >= 0;
	}

	function traverse(regions, region, vector, lastRegion, callback) {

		if(!region) return;

		console.log('region.traversable', region.traversable);
		
		var orientations = region.getOrientations(0);

		for (var i = orientations.length - 1; i >= 0; i--) {

			var orientation = orientations[i];
			
			var newVector = {
				x:region.x + orientation.vector.x,
				y:region.y + orientation.vector.y,
				o: orientation
			};

			var neighbor = getRegionAt(allRegions, newVector)

			if(neighbor && neighbor.getOrientations(0).indexOf(Orientation.getOpposite(orientation)) < 0){
				misMatched.push(neighbor);
				continue;
			}

			if(neighbor && tileRegions.indexOfneighbor >= 0){
				callback(neighbor, newVector);
			}
		};
	}

	search(tileRegions, filter, traverse);
	
	return misMatched;
}

Game.prototype.getNubs = getNubs;
function getNubs(gameRegions){

	gameRegions = $.grep(gameRegions, function(region){
		return region.traversable
	})

	function filter(region, vector, lastRegion){
		vector && !region && nubs.push(new Region(vector.x, vector.y))
		return true;
	}

	nubs = [];

	search(gameRegions, filter, traverse);
	
	return nubs;
}

function traverse(regions, region, vector, lastRegion, callback) {

	if(!region) return;

	var orientations = region.getOrientations(0);

	for (var i = orientations.length - 1; i >= 0; i--) {

		var orientation = orientations[i];
		
		var newVector = {
			x:region.x + orientation.vector.x,
			y:region.y + orientation.vector.y,
			o: orientation
		};

		var neighbor = getRegionAt(regions, newVector)

		if(neighbor && neighbor.getOrientations(0).indexOf(Orientation.getOpposite(orientation)) < 0){
			continue;
		}

		callback(neighbor, newVector);
	};
}

Game.prototype.search = search;
function search(regions, filter, traverse, region, vector, lastRegion, logged, unLogged, contiguous){

	var results = [];

	if(contiguous === undefined){
		contiguous = !region;
	}

	if(!logged){
		logged = [];
		unLogged = regions.slice();
	}

	if(region && logged.indexOf(region) >= 0){
		return results;
	}

	var index = unLogged.indexOf(region)	
	if(index >= 0){
		logged.push(unLogged.splice(index, 1)[0]);
	}

	if(filter && filter(region, vector, lastRegion)){
		results.push(region);
	}
	
	traverse(
		regions,
		region,
		vector,
		lastRegion,
		function(neighbor, newVector){
			results = results.concat(search(regions, filter, traverse, neighbor, newVector, region, logged, unLogged, contiguous));
		}
	)

	while(contiguous && !lastRegion && logged.length < regions.length){
		results = results.concat(search(regions, filter, traverse, unLogged[0], vector, region, logged, unLogged, contiguous));
	}

	return results;
}