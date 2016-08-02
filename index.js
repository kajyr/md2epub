'use strict';

const fs = require('fs-promise');
const options = require('commander');

const epub = require('./lib/EpubTemplate');


options
.usage('[options] <file.md>')
.parse(process.argv);


process.on('exit', () => {
	//epub.clear();
});


// Set to avoid duplicates
let files = new Set(options.args.filter((file) => file.match(/.md$/i)));

let tempData = {
	title: 'Le avventure di carlo',
	creator: 'Carlo'
}

for (let file of files) {

	console.log(file)

	epub.create(file).then(function(folder) {

		epub.fillData(folder, tempData)

		// read from command line e template replace data
		// add html files from markdown
		// zip it

	})
}
