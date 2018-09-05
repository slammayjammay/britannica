const request = require('request');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');
const BaseScraper = require('./BaseScraper');

const BASE_URL = `https://www.merriam-webster.com`;

class MerriamWebsterScraper extends BaseScraper {
	async getDefinition(word) {
		const url = `https://www.merriam-webster.com/dictionary/${word}`;

		const { error, body } = await this.get(url);
		if (error) {
			return Promise.resolve({ error });
		}

		const data = this._parseDefinition(body);

		return { data };
	}

	_parseDefinition(body) {
		const { document } = new JSDOM(body).window;

		const attributesEl = document.querySelector('.entry-attr');
		const syllablesEl = attributesEl.querySelector('.word-syllables');

		return {
			word: document.querySelector('h1.hword').textContent,
			partOfSpeech: attributesEl.querySelector('.fl').textContent,
			syllables: syllablesEl ? syllablesEl.textContent.trim() : null,
			definitions: [].map.call(document.querySelector('.vg').querySelectorAll('.sb .dt'), el => {
				return el.textContent.trim().replace(': ', '');
			})
		};
	}
}

module.exports = MerriamWebsterScraper;
