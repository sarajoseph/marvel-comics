const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
	entry : './src/index.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js'
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(c|sc|sa)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.(woff2?|ttf|otf|eot|svg)$/,
				exclude: /node_modules/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles.css'
		})
	]
}