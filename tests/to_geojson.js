var dtmdem = require('../');

var parser = dtmdem.load([
	'./dtm/94201090dem.grd',
	'./dtm/94201091dem.grd',
	'./dtm/94201092dem.grd'
]);

parser.setGridSize(100);
parser.on('data', function(line) {
	console.log(line);
});

parser.on('end', function() {
	console.log('Completed');
});
