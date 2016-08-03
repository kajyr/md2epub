'use strict';

const fs = require('fs-promise');
const path = require('path');
const options = require('commander');
const marked = require('marked');

const epub = require('./lib/EpubTemplate');
const questions = require('./lib/interactive');
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

let gatherInformation = function(file) {
	return readMD(file)
	.then(function(mdData) {
		return questions.ask().then((data) => {
			data.html = marked(mdData)
			return data;
		})
	});
}

for (let file of files) {

	gatherInformation(file).then(function(data) {
		// read from command line e template replace data
		return epub.create(file)
		.then((folder) => epub.fillData(folder, data))
	})
	.then(function(folder) {
		return zipFolder(folder, path.join(process.cwd(), ebookName(file)));
	})
	.then(function(zipfile) {
		console.log('Created', zipfile)
	})
	.catch(function(err) {
		if (err.code === 'ENOENT') {
			console.log('Unable to open', err.path )
		} else {
			console.log(err)
		}
	})


}
