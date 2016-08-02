'use strict';

const fs = require('fs-promise');
const path = require('path');
const options = require('commander');
const marked = require('marked');

const epub = require('./lib/EpubTemplate');
const archiver = require('archiver');


options
.usage('[options] <file.md>')
.parse(process.argv);


process.on('exit', () => {
	//epub.clear();
});


// Set to avoid duplicates
let files = new Set(options.args.filter((file) => file.match(/\.md$/i)));
let ebookName = (file) => file.replace(/md$/i, 'epub');


let d = new Date();
let curr_date = d.getDate();
let curr_month = d.getMonth() + 1; //Months are zero based
let curr_year = d.getFullYear();
let pubDate = curr_year + "-" + curr_month + "-" + curr_date;

let tempData = {
	title: 'Le avventure di carlo',
	creator: 'Carlo',
	publication: pubDate
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
			return folder;
			

		}).then(function(folder) {
			// zip it
			let output = fs.createWriteStream( path.join(process.cwd(), ebookName(file)));
			let archive = archiver('zip');
			output.on('close', function() {
				console.log(archive.pointer() + ' total bytes');
				console.log('archiver has been finalized and the output file descriptor has closed.');
			});

			archive.on('error', function(err) {
				throw err;
			});

			archive.pipe(output);
			archive.bulk([
			  { expand: true, cwd: folder, src: ['*'] }
			]);
			archive.finalize();
		})

	}).catch(function(err) {
		if (err.code === 'ENOENT') {
			console.log('Unable to open', err.path )
		}
	})


}
