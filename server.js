const { join } = require('path');
const { readFileSync } = require('fs');
const express = require('express');
const Vue = require('vue');
const { createRenderer, createBundleRenderer } = require('vue-server-renderer');
const createDevServer = require('./create-dev-server');

const server = express();
const PORT = 8080;

const serverBundle = join(__dirname, '/dist/server-bundle.json');
let renderer = createBundleRenderer(serverBundle, {
	runInNewContext: false,
	template: readFileSync('./src/index.template.html', 'utf-8')
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

server.get('/', (req, res) => {
	const context = {};

	renderer.renderToString(context, (err, html) => {
		if (err) {
			res.end(err);
		} else {
			res.end(html);
		}
	});
});

server.listen(PORT);
console.log(`Serving on port ${PORT}`);
