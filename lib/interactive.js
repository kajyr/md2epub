'use strict';

const questions = require('questions');

let d = new Date();
let curr_date = d.getDate();
let curr_month = d.getMonth() + 1; //Months are zero based
let curr_year = d.getFullYear();
let pubDate = curr_year + "-" + curr_month + "-" + curr_date;


module.exports = {

	ask: function(defaultValues) {
		return new Promise(function(resolve, reject) {


			questions.askMany({
				title: { info:'Title'},
				creator: { info:'Author'},
				publication: { info:'Publication date', required: false },
				language: { info: 'Language', required: false },
				ISBN: { info: 'ISBN', required: false },
				publisher: { info: 'publisher', required: false },
				rights: { info: 'rights', required: false },
				description: { info: 'description', required: false }
			}, {
				publication: pubDate,
				language: 'en'
			}, resolve)


		});
	}


}