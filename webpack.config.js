const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'built.js'
	},
	plugins: [
		new VueLoaderPlugin()
	],
	module: {
		rules: [
			{ loader: 'vue-loader', test: /\.vue$/ }
		]
	}
}
