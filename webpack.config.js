const path = require('path');

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: {
			deepmerge$: path.resolve(__dirname, 'node_modules/deepmerge/dist/umd.js'),
		},
		extensions: [
			'.ts', '.js'
		]
	},
	output: {
		filename: 'cookieBox.js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'production'
};
