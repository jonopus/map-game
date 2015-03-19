var Controller = require('./controller/Controller.js');
var Game = require('./model/Game.js');
var Renderer = require('./view/Renderer.js');

//http://d3js.org/
//http://www.redblobgames.com/grids/hexagons/

function App(){
	console.log('App');

	new Controller(new Game(), new Renderer('mapCanvas'));
}

$(function(){
	new App();
});