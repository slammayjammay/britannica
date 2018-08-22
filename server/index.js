const { readFileSync } = require('fs');
const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { createRenderer, createBundleRenderer } = require('vue-server-renderer');
const createDevServer = require('./create-dev-server');
const BritannicaScraper = require('./BritannicaScraper');

const server = express();
const PORT = 8080;

const serverBundle = join(__dirname, '../dist/server-bundle.json');
let renderer = createBundleRenderer(serverBundle, {
	runInNewContext: false,
	template: readFileSync(join(__dirname, '../src/index.template.html'), 'utf-8')
});

if (process.env.NODE_ENV === 'development') {
	createDevServer(server, {
		onBundled(bundle) {
			renderer = createBundleRenderer(bundle, {
				runInNewContext: false,
				template: readFileSync('./src/index.template.html', 'utf-8')
			});
		}
	});
}

server.use('/dist', express.static('dist'));
server.use(bodyParser.json());

server.post('/search', async (req, res) => {
	const params = req.body;
	const queryString = params['search-query'];

	try {
		const scraper = new BritannicaScraper();
		const { error, data } = await scraper.search(queryString);

		if (error) {
			console.log(error);
			return res.end(error.message);
		}

		res.json(data);
	} catch (e) {
		res.status(500).end('Internal server error.');
		console.log(e);
	}
});

const postRoutes = ['/:category/:topic', '/:category/:topic/:subpage'];

server.post(postRoutes, async (req, res) => {
	const { category, topic, subpage } = req.params;

	try {
		const scraper = new BritannicaScraper();

		let promise;

		if (req.body.scrapeStructure) {
			promise = scraper.scrapeTopicStructure(category, topic, subpage);
		} else {
			promise = scraper.scrapeTopicData(category, topic, subpage);
		}

		const { error, data } = await promise;

		if (error) {
			console.log(error);
			return res.end(error.message);
		}

		res.json(data);
	} catch (e) {
		res.status(500).end('Internal server error.');
		console.log(e);
	}
});

server.get('*', (req, res) => {
	const context = { url: req.url };

	renderer.renderToString(context, (err, html) => {
		if (err) {
			console.log(err);

			if (err.code === 404) {
				return res.status(404).end('Page not found.');
			} else {
				return res.status(500).end('Internal server error.');
			}
		}

		res.end(html);
	});
});


server.listen(PORT);
console.log(`Serving on port ${PORT}`);
