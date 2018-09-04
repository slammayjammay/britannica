const request = require('request');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');
const parseBritannicaHTMLFromElement = require('./parse-britannica-html-from-element');

const BASE_URL = `https://www.britannica.com`;
const SEARCH_URL = `${BASE_URL}/search?query=`;

class BritannicaScraper {
	async search(queryString) {
		queryString = querystring.escape(queryString);

		const { error, body } = await this.get(`${SEARCH_URL}${queryString}`);
		if (error) {
			return Promise.resolve({ error });
		}

		const results = this._parseSearchResults(body);

		return {
			data: {
				queryString,
				results
			}
		};
	}

	_parseSearchResults(body) {
		const { document } = new JSDOM(body).window;
		const resultsEl = document.querySelector('.search-results ul.results');
		const itemEls = resultsEl.querySelectorAll('li[data-topic-id]');

		const results = [].map.call(itemEls, el => {
			const anchor = el.querySelector('a');
			const title = anchor.textContent;
			const url = anchor.getAttribute('href');

			return { title, url };
		});

		return results;
	}

	async scrapeTopicStructure(category, topic, subpage) {
		if (!topic || !category) {
			return { error: new Error('URL must have topic and category.') };
		}

		const url = `${BASE_URL}/${category}/${topic}${subpage ? '/' + subpage : ''}`;
		const { error, body } = await this.get(url);
		if (error) {
			return Promise.resolve({ error });
		}

		const { document } = new JSDOM(body).window;
		const data = {};

		const sidebarEl = document.querySelector('.md-toc-panel');

		if (!sidebarEl) {
			return this.scrapeTopicData(category, topic, subpage);
		}

		const li = [].slice.call(sidebarEl.querySelectorAll('.md-toc-panel li'));

		data.sections = li.map(el => {
			return {
				level: parseInt(el.parentElement.getAttribute('data-level').slice(1)),
				id: el.getAttribute('data-target').replace('#', ''),
				sidebarHeader: el.children[0].textContent
			};
		});

		data.intro = data.sections.shift();

		data.facts = (() => {
			const factsEl = document.querySelector('.fact-box');
			if (!factsEl) {
				return [];
			}

			return [].slice.call(factsEl.querySelectorAll('dl')).map(boxEl => {
				return {
					header: boxEl.querySelector('dt') && boxEl.querySelector('dt').textContent,
					elements: (() => {
						const selector = boxEl.querySelector('ul') ? 'li' : 'dd';
						return [].map.call(
							boxEl.querySelectorAll(selector),
							el => parseBritannicaHTMLFromElement(el)
						);
					})()
				};
			});
		})();

		return { data };
	}

	async scrapeTopicData(category, topic, subpage) {
		if (!topic || !category) {
			return { error: new Error('URL must have topic and category.') };
		}

		const url = `${BASE_URL}/${category}/${topic}${subpage ? '/' + subpage : ''}`;
		this.url = url;
		const { error, body } = await this.get(url);
		if (error) {
			return Promise.resolve({ error });
		}

		const { document } = new JSDOM(body).window;
		const data = this._constructTopicData(document);

		return { data };
	}

	_constructTopicData(document) {
		const data = { scraped: true };

		if (document.querySelector('#content h1') !== null) {
			data.intro = this._constructTopicIntro(document);
		}

		const mainContentEl = document.querySelector('.md-article-container');

		const sections = [].slice
			.call(document.querySelectorAll('#article-content section'))
			// filter out any sections that do not container a header child element
			.filter(sectionEl => {
				return [].slice.call(sectionEl.children).some(childEl => /H\d/.test(childEl.tagName));
			});

		data.sections = sections.map(sectionEl => {
			return this._constructSectionData(sectionEl);
		});

		data.nextUrls = (() => {
			const sidebarEl = document.querySelector('.md-toc-panel');
			if (!sidebarEl) {
				return [];
			}

			const urls = [];

			[].slice.call(sidebarEl.querySelectorAll('a')).forEach(a => {
				const href = a.getAttribute('href');

				if (!href.includes('#')) {
					urls.push(href);
				}
			});

			return urls;
		})();

		return data;
	}

	_constructTopicIntro(document) {
		const introSection = document.querySelector('#content article section');
		const introWarning = (() => {
			const warningEl = document.querySelector('#content .md-byline .article-type-warning');
			return warningEl ? warningEl.textContent : null;
		})();

		const data = this._constructSectionData(introSection, { isIntro: true, introWarning });

		return Object.assign(data, {
			introWarning,
			intro: true,
			header: document.querySelector('#content h1').textContent,
			writtenBy: [].map.call(
				document.querySelectorAll('#content .md-byline .written-by > ul li'),
				el => el.textContent
			)
		});
	}

	_constructSectionData(sectionEl, details = {}) {
		const { isIntro, introWarning } = details;

		const level = parseInt(sectionEl.getAttribute('data-level'));
		const headerLevel = Math.min(2, level + 1);
		const elements = [];

		function dig(el) {
			if (['P', 'IMG'].includes(el.tagName)) {
				elements.push(el);
				return;
			}

			[].filter.call(el.childNodes, el => el.tagName !== 'SECTION').forEach(dig);
		}

		if (!introWarning) {
			dig(sectionEl);
		}

		return {
			level: parseInt(sectionEl.getAttribute('data-level')),
			id: sectionEl.getAttribute('id').replace('#', ''),
			header: isIntro ? null : sectionEl.querySelector(`h${headerLevel}`).textContent,
			elements: elements.map(el => parseBritannicaHTMLFromElement(el))
		};
	}

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

module.exports = BritannicaScraper;
