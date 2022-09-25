const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: mode,
  entry: './src/js/controller.js',

  output: {
    filename: mode === 'development' ? 'main.js' : 'bundle-[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename:
        mode === 'development' ? '[name].css' : '[name].[contenthash].css',
      chunkFilename:
        mode === 'development' ? '[id].css' : '[id].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ],

  // target: 'web',
  devtool: 'source-map',
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
      serveIndex: true,
    },
  },
};
