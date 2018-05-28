const path = require('path')
	, pgkInfo = require('./package')

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
		filename: `cookiebox-${pgkInfo.version}.js`,
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'production'
}
