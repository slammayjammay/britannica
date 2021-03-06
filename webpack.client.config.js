const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: './src/entry-client.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'built.js',
		publicPath: '/dist'
	},
	plugins: [
		new VueLoaderPlugin()
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
