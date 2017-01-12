var Duplex = require('stream').Duplex;
var util = require('util');
var twd97tolatlng = require('twd97-to-latlng');

var Parser = module.exports = function(options) {
	if (!(this instanceof Parser))
		return new Parser(options);

	Duplex.call(this, Object.assign({
		objectMode: true
	}, options));

	this._data = [];
	this.pending = false;
	this.gridSize = 1;
}

util.inherits(Parser, Duplex);

Parser.prototype._write = function(chuck, encoding, callback) {

	if (!chuck) {
		this.push(null);
		return;
	}

	var data = chuck.toString().split(' ');
	var area = [];

	var x = parseInt(data[0]);
	var y = parseInt(data[1]);

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
		e: parseFloat(data[2])
	};

	this._data.push(result);

	// Listener is waiting
	if (this.pending) {
		this.pending = false;
		this._read();
	}

	callback();
};

Parser.prototype._read = function() {

	if (this._data.length) {
		this.push(this._data.shift());
	} else {
		this.pending = true;
	}
};

Parser.prototype.setGridSize = function(size) {
	this.gridSize = size;
};
