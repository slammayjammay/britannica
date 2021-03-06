const nodeExternals = require('webpack-node-externals');
const autoprefixer = require('autoprefixer');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VueServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/entry-server.js',
	target: 'node',
	output: {
		libraryTarget: 'commonjs2'
	},
	externals: nodeExternals({
		whitelist: /\.css$/
	}),
	plugins: [
		new VueLoaderPlugin(),
		new VueServerPlugin({ filename: 'server-bundle.json' })
	],
	module: {
		rules: [
			{ loader: 'vue-loader', test: /\.vue$/ },
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [autoprefixer()]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							data: '@import "src/scss/_global.scss";'
						}
					}
				]
			}
		]
	}
};
