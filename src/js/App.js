var Grid = require('./model/Grid.js');
var Tile = require('./model/Tile.js');
var Region = require('./model/Region.js');
var Orientation = require('./model/Orientation.js');
var Renderer = require('./view/Renderer.js');

//http://d3js.org/
//http://www.redblobgames.com/grids/hexagons/

function App(){
	console.log('App');

	var grid = new Grid();
	
	grid.addRegions(new Tile(Region.O3, 0, 0, Orientation.XP).getRegions());
	grid.addRegions(new Tile(Region.O3, 0, 0, Orientation.YP).getRegions());
	grid.addRegions(new Tile(Region.O3, 0, 0, Orientation.ZP).getRegions());
	grid.addRegions(new Tile(Region.O3, 0, 0, Orientation.XM).getRegions());
	grid.addRegions(new Tile(Region.O3, 0, 0, Orientation.YM).getRegions());
	grid.addRegions(new Tile(Region.O3, 0, 0, Orientation.ZM).getRegions());
	

	/*
	grid.addRegions(new Tile(Region.O3, 0, 4).getRegions());
	grid.addRegions(new Tile(Region.O2, 4, 4).getRegions());
	grid.addRegions(new Tile(Region.O1, 8, 4).getRegions());
	
	grid.addRegions(new Tile(Region.C3, 0, 8).getRegions());
	grid.addRegions(new Tile(Region.C2, 4, 8).getRegions());
	grid.addRegions(new Tile(Region.C1, 8, 8).getRegions());
	*/
	
	
	new Renderer('mapCanvas').render(grid);
}

$(function(){
	new App();
});