var fs = require('fs');
var path = require('path');
var readline = require('readline');
var Parser = require('./parser');

module.exports = {
	_load: function(filename, parser) {

		return new Promise(function(resolve, reject) {
			var input = fs.createReadStream(path.resolve(filename));

			var lineReader = readline.createInterface({
				input: input
			});

			lineReader.on('line', function(line) {
				parser.write(line);
			});

			lineReader.on('close', function() {

				resolve();
			})
		});
	},
	load: function(filename, opts) {

		var parser = new Parser(opts);

		if (filename instanceof Array) {

			new Promise(function(resolve) { 

				function _load(index) {

					// Complete
					if (filename.length <= index)
						return resolve();

					this._load(filename[index], parser)
						.then(function() {
							_load.bind(this)(index + 1);
						}.bind(this));
				}

				_load.bind(this)(0);

			}.bind(this)).then(function() {
				parser.push(null);
			});

			return parser;
		}

		this._load(filename, parser)
			.then(function() {
				parser.push(null);
			});

		return parser;
	}
}
