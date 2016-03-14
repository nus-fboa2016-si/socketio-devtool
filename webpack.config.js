var path = require('path')
var webpack = require('webpack')

module.exports = {
	devtool: 'inline-source-map',
	entry: {
		app: './src/app/index.js',
		//connect: './src/chrome/src/connect.js',
		checkForIO: './src/chrome/src/checkForIO.js'
	},
	output: {
		path: path.join(__dirname, 'src/chrome/dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
			},
			{
				test: /\.scss$/,
				loaders: [
					'style?sourceMap', 
					'css?modules&importLoaders=1&localIdentName=[path]__[name]__[local]__hash:base64:5]', 
					'resolve-url', 
					'sass?sourceMap'
				]
			},
			{ test: /\.png$/, loader: 'url-loader?limit=100000' },
			{ test: /\.jpg$/, loader: 'file-loader'}
		]
	}
}