'use strict';

const fs = require('fs-promise');
const options = require('commander');
const epub = require('./lib/EpubTemplate');


options
.usage('[options] <file.md>')
.parse(process.argv);

process.on('exit', () => {
	epub.clear();
});


// Set to avoid duplicates
let files = new Set(options.args.filter((file) => file.match(/.md$/i)));


for (let file of files) {

	console.log(file)

	epub.create(file);
}
