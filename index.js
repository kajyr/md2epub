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
	epub.clear();
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

let zipFolder = function(folder, zipFilePath) {
	return new Promise((resolve, reject) => {

		let output = fs.createWriteStream(zipFilePath);
		let archive = archiver('zip');
		output.on('close', function() {
			return resolve(zipFilePath);
		});
		archive.on('error', function(err) {
			return reject(err);
		});

		archive.pipe(output);
		archive.directory(folder);
		archive.finalize();
	})
}

for (let file of files) {

	readMD(file).then(function(mdData) {

		let html = marked(mdData);

		tempData.html = html;
		// read from command line e template replace data

		epub.create(file).then(function(folder) {

			return epub.fillData(folder, tempData).then(() => folder)
		
		}).then(function(folder) {
			// zip it
			return zipFolder(folder, path.join(process.cwd(), ebookName(file)));
		}).then(function(zipfile) {
			console.log('Created', zipfile)
		})

	}).catch(function(err) {
		if (err.code === 'ENOENT') {
			console.log('Unable to open', err.path )
		}
	})


}
