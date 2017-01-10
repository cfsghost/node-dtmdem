# dtmdem

dtmdem is used to parse DEM (Digital Elevation Model) data and convert to GeoJson format.

[![NPM](https://nodei.co/npm/dtmdem.png)](https://nodei.co/npm/dtmdem/)

## Installation

Install via NPM:
```
npm install dtmdem
```

## Usage
```js
var dtmdem = require('dtmdem');

// Load multiple DTM-DEM files
var parser = dtmdem.load([
	'./dtm/94201090dem.grd',
	'./dtm/94201091dem.grd',
	'./dtm/94201092dem.grd'
]);

// Set cell size
parser.setGridSize(100);
parser.on('data', function(line) {
	console.log(line);
});

parser.on('end', function() {
	console.log('Completed');
});
```

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2016 Fred Chien <<cfsghost@gmail.com>>
