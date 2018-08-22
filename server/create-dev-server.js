const { join } = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');
const clientConfig = require('../webpack.client.config');
const serverConfig = require('../webpack.server.config');

module.exports = (server, options = {}) => {
	const clientCompiler = webpack(clientConfig);
	const serverCompiler = webpack(serverConfig);

	server.use(require('webpack-dev-middleware')(clientCompiler, {
		logLevel: 'silent',
		publicPath: clientConfig.output.publicPath
	}));

	console.log('watching...');

	const mfs = new MFS();
	const outputPath = join(clientConfig.output.path, 'server-bundle.json');
	serverCompiler.outputFileSystem = mfs;

	serverCompiler.watch({}, (err, stats) => {
		if (err) {
			throw err;
		}

		console.log('compiled.');

		const bundle = JSON.parse(mfs.readFileSync(outputPath, 'utf-8'));
		options.onBundled && options.onBundled(bundle);
	});
};
