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

Game.prototype.getRegions = getRegions;
function getRegions(){

	var regions = [];

	for (var i = this.tiles.length - 1; i >= 0; i--) {
		var tile = this.tiles[i];
		regions = regions.concat(tile.getRegions());
	};

	// set claim flag.
	for (var p = this.players.length - 1; p >= 0; p--) {
		var player = this.players[p];
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

	console.log('region', region);

	return regions;

	//hasLiberties(region, regions)
}

function hasLiberties(tile, region){
	//region.getOrientations(tile.orientation)
}