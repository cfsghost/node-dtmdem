var Transform = require('stream').Transform;
var util = require('util');
var twd97tolatlng = require('twd97-to-latlng');

var Parser = module.exports = function(options) {
	if (!(this instanceof Parser))
		return new Parser(options);

	this.options = options;

	Transform.call(this, Object.assign({
		objectMode: true,
		outputString: false
	}, options));

	this.pending = false;
	this.gridSize = 1;
}

util.inherits(Parser, Transform);

Parser.prototype._transform = function(chuck, encoding, callback) {

	if (!chuck) {
		this.push(null);
		return;
	}

	var data = chuck.toString().split(' ');
	var area = [];

	var x = parseInt(data[0]);
	var y = parseInt(data[1]);
	var elevation = parseFloat(data[2]);

	var point = twd97tolatlng(x, y);
	area.push([ point.lng, point.lat ]);

	var point = twd97tolatlng(x, y + this.gridSize);
	area.push([ point.lng, point.lat ]);

	var point = twd97tolatlng(x + this.gridSize, y + this.gridSize);
	area.push([ point.lng, point.lat ]);

	var point = twd97tolatlng(x + this.gridSize, y);
	area.push([ point.lng, point.lat ]);

	var result = {
		area: {
			type: 'Polygon',
			coordinates: area
		},
		e: elevation
	};

	if (this.options.outputString) {
		this.push(JSON.stringify(result));
	} else {
		this.push(result);
	}

	callback();
};

Parser.prototype.setGridSize = function(size) {
	this.gridSize = size;
};
