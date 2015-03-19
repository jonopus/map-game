module.exports = Game;
function Game() {
	console.log('Game');
	this.tiles = [];
	this.players = [];
}

Game.prototype.addPlayer = addPlayer;
function addPlayer(player){
	this.players.push(player);
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

/*

Game.prototype.getClaaimedRegions = getClaaimedRegions;
function getClaaimedRegions(){

	var claims = [];

	for (var i = this.players.length - 1; i >= 0; i--) {
		var player = this.players[i];
		claims = claims.concat(tile.getClaaimedRegions());
	};
	return claims;
}
*/

Game.prototype.getRegions = getRegions;
function getRegions(){

	var regions = [];

	for (var i = this.tiles.length - 1; i >= 0; i--) {
		var tile = this.tiles[i];
		regions = regions.concat(tile.getRegions());
	};
	return regions;
}

Game.prototype.getLiberties = getLiberties;
function getLiberties(tileId, regionId){
	console.log('getLiberties', tileId, regionId);

	var regions = this.getRegions();



	var region = $.grep(regions, function(region){
		return parseInt(region.tileId) === parseInt(tileId) && parseInt(region.id) === parseInt(regionId);
	})[0];

	if(!region.claimable) return false;

	return getNeighbor(regions, region);
}

function getNeighbor(regions, region, startRegion){
	var liberties = [];

	var orientations = region.getOrientations(0);

	for (var i = orientations.length - 1; i >= 0; i--) {


		var vector = {
			x:region.x + orientations[i].vector.x,
			y:region.y + orientations[i].vector.y
		};

		console.log('neighbor vector', vector, orientations[i]);

		var neighbor = getRegionAt(regions, vector)

		if(!neighbor){
			continue;
		}

		neighbor.mapped = true;
			

		if(neighbor.claimable){

			console.log('neighbor.claimed', neighbor.claimed);

			if(!neighbor.claimed){
				liberties.push(neighbor);
			}
		}else{
			liberties = liberties.concat(getNeighbor(regions, neighbor, startRegion));
		}
		
	};

	return liberties;
}

function getRegionAt(regions, vector){
	return $.grep(regions, function(region){
		return region.x === vector.x && region.y === vector.y;
	})[0];
}