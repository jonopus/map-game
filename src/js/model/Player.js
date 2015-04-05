var count = 0;

module.exports = Player;
function Player(color) {
	this.id = ++count;
	this.color = color;
	this.claims = [];
}

Player.prototype.removeClaim = function(tileId, regionId){
	this.claims = $.grep(this.claims, function(item){
		return !(item.tileId === tileId && item.regionId === regionId);
	})
}

Player.prototype.addClaim = function(region){
	
	if($.grep(this.claims, function(item){
		return item.tileId === region.tileId && item.regionId === region.regionId;
	}).length){
		return false;
	}

	this.claims.push({
		playerId: this.id,
		tileId: region.tileId,
		regionId: region.regionId
	});

	return true;
}

Player.prototype.getClaims = function(){
	return this.claims;
}