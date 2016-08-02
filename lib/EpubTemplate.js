'use strict';

const path = require('path'); 
const fs = require('fs-promise');
const ejs = require('ejs');

const template = path.join(__dirname, '../templates/epub');
const tempdir = path.join(__dirname, '../temp');


let filenameWithoutExtension = (filename) => filename.replace(/.md$/i, '');

let readFile = (file) => {
	return fs.readFile(file.path, 'utf8')
	.then((data) => {
		file.content = data;		
		return file;
	})
}

let multiplex = (array, cb) => {
	var p = [];
	for (let a of array) {
		p.push(cb(a));
	}
	return Promise.all(p);
}

let findEjs = (folder) => {
	return fs.walk(folder).then((files) => {
		files = files.filter((file) => file.path.match(/\.ejs$/i))
		return multiplex(files, readFile);
	})
}

let substituteTemplate = (templateFile, data) => {
	let str = ejs.render(templateFile.content, {data: data});
	let fileName = templateFile.path.replace(/\.ejs$/i, '');
	return fs.outputFile(fileName, str, 'utf8')
		.then(() => fs.remove(templateFile.path))
}

module.exports = {
	create: function(filename) {
		let folder = path.join(tempdir, filenameWithoutExtension(filename))

		return fs.ensureDir(tempdir).then(function() {
			return fs.copy(template, folder)
		})
		.then(() => folder)
	},
	fillData: function(folder, data) {
		return findEjs(folder)
		.then((files) => {
			return multiplex(files, (file) => substituteTemplate(file, data))
		})
	},
	addContent: function(folder, html) {

	},
	clear: function() {
		// This must be sync because it is clled upon process.exit
		return fs.emptyDirSync(tempdir);
	}
}