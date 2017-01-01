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
		len: 1,
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
	var origin = [
		this.origin.x + parseInt(data[0]),
		this.origin.y + parseInt(data[1])
	];

	var area = [];
	area.push(origin);
	area.push([ origin[0], origin[1] + this.origin.size ]);
	area.push([ origin[0] + this.origin.size, origin[1] + this.origin.size ]);
	area.push([ origin[0] + this.origin.size, origin[1] ]);

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
