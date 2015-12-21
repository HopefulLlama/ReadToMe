function Script() {
	var _this = this;
	this.contents = "";
	
	this.hasContents = function() {
		return (typeof _this.contents !== 'undefined' && _this.contents !== null && _this.contents !== "");
	}

	this.clear = function() {
		_this.contents = "";
		return _this.contents;
	}
}