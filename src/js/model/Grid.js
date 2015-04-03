var Orientation = require('./Orientation.js');
var Tile = require('./Tile.js');
var Ports = require('./Ports.js');

module.exports = Grid;
function Grid() {}

Grid.getRegions = function(tiles){

	var regions = []

	$.map(tiles, function(tile){
		$.map(tile.ports.getRegions(), function(id){
			regions.push({
				tileId:tile.id,
				regionId:id
			})
		})
	})

	return regions;
}

Grid.getTile = function(tiles, id){
	return $.grep(tiles, function(tile){return tile.id == id;})[0];
}

Grid.getRegion = function(regions, tileId, regionId){
	return $.grep(regions, function(region){
		return region.tileId === tileId && region.regionId === regionId;
	})[0];
}

Grid.getTileAt = function(tiles, vector){
	return $.grep(tiles, function(tile){
		return tile.x === vector.x && tile.y === vector.y;
	})[0];
}

Grid.getRegionAtVector = function(tiles, regions, tile, vector){
	if(!tile){
		return
	}
	var tileAtVector = Grid.getTileAt(tiles, vector);
	if(!tileAtVector){
		return;
	}
	var portIndices = (((vector.i + 9) + ((1-(vector.i%3)) * 2))%18);
	var ports = tileAtVector.getPorts()
	var regionId = ports.ports[portIndices];

	return Grid.getRegion(regions, tileAtVector.id, regionId);
}

Grid.getMisMatches = function(gameTiles, gameRegions, tile){
	allTiles = gameTiles.concat([tile]);

	var tileRegions = $.map(tile.ports.getRegions(), function(id){
		return {
			tileId:tile.id,
			regionId:id
		}
	})

	var allRegions = gameRegions.concat(tileRegions);

	var results = [];

	function traverse(regions, region, vector, lastRegion, callback){
		
		if(
			!region
		) return;


		var nextTile = Grid.getTile(allTiles, region.tileId);
		var vectors = nextTile.getPortVectors(region.regionId)
		
		for (var i = vectors.length - 1; i >= 0; i--) {
			var nextVector = vectors[i]
			var nextRegion = Grid.getRegionAtVector(allTiles, allRegions, nextTile, nextVector);
			
			if(!region || !nextRegion)
				continue

			if(
				(region.regionId === 0 && nextRegion.regionId !== 0) ||
				(region.regionId !== 0 && nextRegion.regionId === 0)
			){
				results.push(nextRegion);
			}
		};
	}

	Grid.search(tileRegions, null, traverse);

	return results;
}

Grid.getLiberties = function(tiles, regions, firstRegion, playerId){

	function filter(region, vector, lastRegion){

		return (
			region &&
			region !== firstRegion && 
			!region.playerId
		);
	}

	function traverse(regions, region, vector, lastRegion, callback){
		if(
			!region ||
			(region && region.regionId === 0) || (
				region.playerId !== playerId &&
				region !== firstRegion
			)
		) return;

		var nextTile = Grid.getTile(tiles, region.tileId);
		var vectors = nextTile.getPortVectors(region.regionId)

		for (var i = vectors.length - 1; i >= 0; i--) {
			var nextVector = vectors[i]
			var nextRegion = Grid.getRegionAtVector(tiles, regions, nextTile, nextVector);
			callback(nextRegion, nextVector);
		};
	}

	return Grid.search(regions, filter, traverse, Grid.getRegion(regions, firstRegion.tileId, firstRegion.regionId));
}

Grid.getGroup = function(tiles, regions, firstRegion, playerId){

	function filter(region, vector, lastRegion){

		return (
			region &&
			region.playerId === playerId
		);
	}

	function traverse(regions, region, vector, lastRegion, callback){
		if(
			!region ||
			(region && region.regionId === 0) || (
				region.playerId !== playerId &&
				region !== firstRegion
			)
		) return;

		var nextTile = Grid.getTile(tiles, region.tileId);
		var vectors = nextTile.getPortVectors(region.regionId)

		for (var i = vectors.length - 1; i >= 0; i--) {
			var nextVector = vectors[i]
			var nextRegion = Grid.getRegionAtVector(tiles, regions, nextTile, nextVector);
			callback(nextRegion, nextVector);
		};
	}

	var results = Grid.search(regions, filter, traverse, Grid.getRegion(regions, firstRegion.tileId, firstRegion.regionId));

	return results;
}

Grid.getCaptures = function(tiles, regions, firstRegion, playerId){

	var results = [];

	function filter(region, vector, lastRegion){

		if (
			region &&
			region.playerId &&
			region.playerId !== playerId &&
			Grid.getLiberties(tiles, regions, region, region.playerId).length <= 1
		) {
			results = results.concat(Grid.getGroup(tiles, regions, region, region.playerId));
		}
	}

	function traverse(regions, region, vector, lastRegion, callback){
		if(
			!region ||
			(region && region.regionId === 0) ||
			lastRegion === firstRegion
		) return;

		var nextTile = Grid.getTile(tiles, region.tileId);
		var vectors = nextTile.getPortVectors(region.regionId)

		for (var i = vectors.length - 1; i >= 0; i--) {
			var nextVector = vectors[i]
			var nextRegion = Grid.getRegionAtVector(tiles, regions, nextTile, nextVector);
			callback(nextRegion, nextVector);
		};
	}

	Grid.search(regions, filter, traverse, Grid.getRegion(regions, firstRegion.tileId, firstRegion.regionId));

	return results;
}

Grid.getNubs = function(tiles, regions){

	var nubLog = []
	var results = []

	function filter(region, vector, lastRegion){
		if(!vector) return;

		var nubId = vector.x + ', ' + vector.y;

		if(!region && nubLog.indexOf(nubId) < 0){
			nubLog.push(nubId);
			results.push(new Tile(vector.x, vector.y, null, Orientation.getOpposite(vector.o)))
		}
	}


	function traverse(regions, region, vector, lastRegion, callback){
		if(
			!region ||
			(region && region.regionId === 0)
		) return;

		var nextTile = Grid.getTile(tiles, region.tileId);
		var vectors = nextTile.getPortVectors(region.regionId)

		for (var i = vectors.length - 1; i >= 0; i--) {
			var nextVector = vectors[i]
			var nextRegion = Grid.getRegionAtVector(tiles, regions, nextTile, nextVector);
			callback(nextRegion, nextVector);
		};
	}

	Grid.search(regions, filter, traverse);

	return results;
}

Grid.search = function(regions, filter, traverse, region, vector, lastRegion, logged, unLogged, contiguous){

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
		function(nextRegion, nextVector){
			results = results.concat(Grid.search(regions, filter, traverse, nextRegion, nextVector, region, logged, unLogged, contiguous));
		}
	)

	while(contiguous && !lastRegion && logged.length < regions.length){
		results = results.concat(Grid.search(regions, filter, traverse, unLogged[0], vector, region, logged, unLogged, contiguous));
	}

	return results;
}
