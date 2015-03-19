module.exports = Player;
function Player(id, color) {
	this.id = id;
	this.color = color;
	this.claims = [];
}

Player.prototype.removeClaim = removeClaim;
function removeClaim(tileId, regionId){

	console.log('this.claim a', tileId, regionId, this.claims);

	this.claims = $.grep(this.claims, function(item){
		return !(item.tileId === tileId && item.regionId === regionId);
	})

	console.log('this.claims b', tileId, regionId, this.claims);
}

Player.prototype.claim = claim;
function claim(tileId, regionId){
	
	var claim = {tileId:tileId, regionId:regionId, player:this};

	if($.grep(this.claims, function(item){
		return item.tileId === claim.tileId && item.regionId === claim.regionId;
	}).length){
		return false;
	}

	this.claims.push(claim);

	return claim;
}

Player.prototype.getClaims = getClaims;
function getClaims(){
	return this.claims;
}