const request = require('request');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');

class BaseScraper {
	get(url) {
		return new Promise(resolve => {
			request.get(url, (error, res, body) => {
				if (error) {
					resolve({ error });
				} else if (res.statusCode !== 200) {
					resolve({ error: new Error(`"${url}" responded with a status of "${res.statusCode}"`) });
				} else {
					resolve({ body });
				}
			});
		});
	}
}

module.exports = BaseScraper;
