module.exports = Player;
function Player(id, color) {
	this.id = id;
	this.color = color;
	this.claims = [];
}

Player.prototype.claim = claim;
function claim(tileId, regionId){
	this.claims.push({tileId:tileId, regionId:regionId, player:this});

	var claims = this.claims;

	var unique = []

	$.grep(claims, function(claim){
		var matches = $.grep(unique, function(claimInUnique){
			return claimInUnique.tileId === claim.tileId && claimInUnique.regionId === claim.regionId;
		}).length;

		if(!matches){
			unique.push(claim)
		}
	});

	this.claims = unique;
}

Player.prototype.getClaims = getClaims;
function getClaims(){
	return this.claims;
}