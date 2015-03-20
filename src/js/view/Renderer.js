var d3 = require('d3');

var svg;
var mainGorup;
var scale = 40;
var d2 = Math.sqrt(3);
var hexagon = [
	{x:(d2*-.5) + d2,		y:(-1) + .5},
	{x:(d2*-.5) + d2,		y:(-1) + 1.5},
	{x:(d2*-.5) + d2*.5,	y:(-1) + 2},
	{x:(d2*-.5) + 0,		y:(-1) + 1.5},
	{x:(d2*-.5) + 0,		y:(-1) + .5},
	{x:(d2*-.5) + d2*.5,	y:(-1) + 0}
]
var orthagonal = [
	{x:(d2*-.5) + d2,		y:(-1) + 1},
	{x:(d2*-.5) + d2*.75,	y:(-1) + 1.75},
	{x:(d2*-.5) + d2*.25,	y:(-1) + 1.75},
	{x:(d2*-.5) + 0,		y:(-1) + 1},
	{x:(d2*-.5) + d2*.25,	y:(-1) + .25},
	{x:(d2*-.5) + d2*.75,	y:(-1) + .25}
]

module.exports = Renderer;
function Renderer(selector) {
	svg = d3.select("body")
	.append("svg")
	.attr("width", 1000)
	.attr("height", 900)
	
	mainGorup = svg.append("g")
	.attr("transform", "translate(500,350)");

	var regionGroup = svg.append("g")
	
	regionGroup.append("circle")
	.attr("r", 5)
	.attr("fill", '#555')
	.attr("transform", "translate(500,350)");

	$('svg').on('click', '.region', handleClickRegion);
	$('svg').on('mouseover', '.region', handleMouseoverRegion);
	$('svg').on('mouseout', '.region', handleMouseoutRegion);
}

Renderer.prototype.render = render;
function render(regions){
	mainGorup.selectAll("*").remove();

	for (var i = regions.length - 1; i >= 0; i--) {
		renderRegion(regions[i], i);
	};
}

Renderer.prototype.highlight = highlight;
function highlight(className, regions){
	
	$('.'+className)
	.attr("class", function(index, classNames) {
		return classNames.replace(className, '');
	});

	for (var i = regions.length - 1; i >= 0; i--) {
		var region = regions[i];
		
		$('#region-' + region.tileId + '-' + region.id)
		.attr("class", function(index, classNames) {
			return classNames + ' ' + className;
		});
	};

}

function handleClickRegion(){
	var region = d3.select(this);
	$('body').trigger('REGION_CLICKED', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function handleMouseoverRegion(){
	var region = d3.select(this);
	$('body').trigger('REGION_MOUSEOVER', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function handleMouseoutRegion(){
	var region = d3.select(this);
	$('body').trigger('REGION_MOUSEOUT', [region.attr("data-tile-id"), region.attr("data-region-id")])
}

function renderRegion(region, index){
	var x = (((region.x) * d2) + (region.y * (d2*.5)));
	var y = (region.y)*1.5;
	var cx = 0;
	var cy = 0;

	var polygon = [];
	var lines = []

	for (var i = hexagon.length - 1; i >= 0; i--) {
		var point = hexagon[i];
		polygon.push({
			x:point.x*scale,
			y:point.y*scale
		});
	};

	for (var i = orthagonal.length - 1; i >= 0; i--) {
		var point = orthagonal[i];
		if(region.l[i]){
			lines.push([
			{
				x:cx*scale,
				y:cy*scale
			},
			{
				x:point.x*scale,
				y:point.y*scale
			}
			])
		}
	};

	var regionGroup = mainGorup.append("g")
	.attr("id", 'region-' + region.tileId + '-' + region.id)
	.attr("transform", "translate("+(x*scale)+","+(y*scale)+")")
	.attr("class", 
		'region'
		+ (region.claimed ? ' claimed ' + region.claimed.player.color : '')
	)
	.attr("data-region-id", region.id)
	.attr("data-tile-id", region.tileId)
	.attr("data-x", region.x)
	.attr("data-y", region.y);

	
	regionGroup.selectAll("hex" + index)
	.data([polygon])
	.enter()
	.append("polygon")
	.attr("class", 'hexagon')
	.attr("points",function(d) { 
		return d.map(function(d) {
			return [
			d.x,
			d.y
			].join(",");
		}).join(" ");
	});

	regionGroup.selectAll("lines" + index + i)
	.data(lines)
	.enter()
	.append("polygon")
	.attr("points",function(d) { 
		return d.map(function(d) {
			return [
			d.x,
			d.y
			].join(",");
		}).join(" ");
	})
	.attr("stroke-width", 1)
	.attr("stroke", "red");

	//region.claim

	if(region.claimable){

		regionGroup.append("circle")
		.attr("class", 'claimable')
		.attr("r", 14)
		.attr("fill", '#555');


		regionGroup.append("circle")
		.attr("class", 'claim-mark')
		.attr("r", 8);
	}

}

