const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
      index: './js/oop.js'
  },
  devtool: 'inline-source-map',
  devServer : {
      contentBase: './dist'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  module: {
    rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                            'file-loader'
                ]
            }
        ]
  },
  plugins: [
       //new CleanWebpackPlugin(['dist']),
      new webpack.ProvidePlugin({
        $: 'jquery'
    }),
  ],
  mode: 'production'
};