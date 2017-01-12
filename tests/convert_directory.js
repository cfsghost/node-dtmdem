var dtmdem = require('../');
var fs = require('fs');
var path = require('path');

var sourcePath = process.argv[2];
var targetPath = path.resolve(process.argv[3]);

fs.readdir(sourcePath, function(err, files) {
	if (err)
		return;

	if (!files.length)
		return;

	files = files.map(function(file) {
		return path.join(sourcePath, file);
	});

	var parser = dtmdem.load(files, {
		outputString: true
	});

	parser.setGridSize(100);

	var output = fs.createWriteStream(targetPath);
	parser.pipe(output);
});

