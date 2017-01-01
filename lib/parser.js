var Duplex = require('stream').Duplex;
var util = require('util');

var Parser = module.exports = function(options) {
	if (!(this instanceof Parser))
		return new Parser(options);

	Duplex.call(this, Object.assign({
		objectMode: true
	}, options));

	this._data = [];
	this.pending = false;
	this.origin = {
		scale: 0,
		len: 0,
		x: 0,
		y: 0,
		size: 1,
	};
}

util.inherits(Parser, Duplex);

Parser.prototype._write = function(chuck, encoding, callback) {

	if (!chuck) {
		this.push(null);
		return;
	}

	var data = chuck.toString().split(' ');
	var size = this.origin.size / this.origin.scale;
	var origin = [
		(this.origin.x + parseInt(data[0])) / this.origin.scale,
		(this.origin.y + parseInt(data[1])) / this.origin.scale
	];
	var newX = parseFloat((origin[0] + size).toFixed(this.origin.len));
	var newY = parseFloat((origin[1] + size).toFixed(this.origin.len));

	var area = [];
	area.push(origin);
	area.push([ origin[0], newY ]);
	area.push([ newX, newY ]);
	area.push([ newX, origin[1] ]);

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

Parser.prototype.setOrigin = function(x, y, size) {
	this.origin.len = parseFloat(x).toString().split('.')[1].length;
	var scale = this.origin.scale = Math.pow(10, this.origin.len);
	this.origin.x = parseFloat(x) * scale;
	this.origin.y = parseFloat(y) * scale;
	this.origin.size = size || this.origin.size;
};
