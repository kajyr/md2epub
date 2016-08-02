'use strict';

const path = require('path'); 
const fs = require('fs-promise');

const template = path.join(__dirname, '../templates/epub');
const tempdir = path.join(__dirname, '../temp');


let filenameWithoutExtension = (filename) => filename.replace(/.md$/i, '');

module.exports = {
	create: function(filename) {
		let folder = path.join(tempdir, filenameWithoutExtension(filename))

		return fs.ensureDir(tempdir).then(function() {
			return fs.copy(template, folder)
		})
		.then(() => folder)
	},

	clear: function() {
		// This must be sync because it is clled upon process.exit
		return fs.emptyDirSync(tempdir);
	}
}