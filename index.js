'use strict';

const fs = require('fs-promise');
const options = require('commander');
const marked = require('marked');

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

let readMD = function(file) {
	return fs.readFile(file, 'utf8')
}

for (let file of files) {

	readMD(file).then(function(mdData) {

		let html = marked(mdData);

		tempData.html = html;
		// read from command line e template replace data

		epub.create(file).then(function(folder) {

			epub.fillData(folder, tempData)

			// zip it

		})

	}).catch(function(err) {
		if (err.code === 'ENOENT') {
			console.log('Unable to open', err.path )
		}
	})


}
