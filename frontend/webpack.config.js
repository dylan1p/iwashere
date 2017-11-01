const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = 9000;

module.exports = {
	entry: [
		'./src/index.js'
	],
	devtool: 'eval-source-map',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options : {
					'presets' : [['env', {modules:false}]],
					'plugins' : [
						"transform-react-jsx",
						'react-hot-loader/babel',
						'transform-object-rest-spread'
					]
				}
			},
			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: 'body',
			template: 'index.html'
		})
	],
	devServer: {
		proxy : {
			'/api/*' : {
				target :'http://localhost:3000'
			}
		},
		noInfo: true,
		inline: true,
		port: PORT

	}
}
