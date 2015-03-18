module.exports = Grid;
function Grid() {
	console.log('Grid');
	this.regions = [];
}

Grid.prototype.addRegions = addRegions;
function addRegions(regions){
	console.log('Grid', 'addRegions', regions);
	this.regions = this.regions.concat(regions);
}

Grid.prototype.addRegion = addRegion;
function addRegion(region){
	console.log('Grid', 'addRegion', region);
	this.regions.push(region);
}

Grid.prototype.getRegions = getRegions;
function getRegions(){
	return this.regions;
}