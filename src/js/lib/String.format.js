if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
			? args[number]
			: match
			;
		});
	};
}

if (!String.format) {
	String.format = function() {
		var args = Array.prototype.slice.call(arguments);

		var string = args.shift();

		return string.format(args);
	};
}