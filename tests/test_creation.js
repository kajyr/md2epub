'use strict';

const test = require('tape');
const fs = require('fs-promise');
const epub = require('../lib/EpubTemplate');

test('Test folder creation ', function (t) {

   	let file = "prova.md";
   	epub.create(file).then(function(folder) {

   		fs.stat(folder).then(function(stats) {

   			t.ok(stats.isDirectory(), 'Viene creata la cartella relativa')
   			
   		}).catch(function(err) {
   			console.log(err)
   		})
   		.then(function() {
   			t.end();
   		})


   	});
});
