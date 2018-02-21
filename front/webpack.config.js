const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/* const webpack = require('webpack'); */
/* const project = require('../project.config'); */

/* const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = file => inProject(project.srcDir, file); */

const config = {
  entry: [
    'react-hot-loader/patch',
    path.resolve(__dirname, 'index.js'),
    path.resolve(__dirname, 'style/mini-nord.scss'),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  devServer: { contentBase: './dist', open: false, port: 3456 },
  resolve: {
    symlinks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'knb-react',
      template: 'index.html',
    }),
    new ExtractTextPlugin({
      // define where to save the file
      filename: 'knb.bundle.css',
      allChunks: true,
    }),
  ],
  module: {
    rules: [],
  },
};

config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['babel-preset-env', 'babel-preset-react'],
      plugins: [
        'react-hot-loader/babel',
        'babel-plugin-syntax-dynamic-import',
        'babel-plugin-transform-class-properties',
        [
          'babel-plugin-transform-object-rest-spread',
          {
            useBuiltIns: true,
          },
        ],
        'lodash',
      ],
    },
  },
});
config.module.rules.push({
  test: /\.scss$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'sass-loader',
    },
  ],
});
config.module.rules.push({
  test: /\.scss$/,
  exclude: /node_modules/,
  loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
});
module.exports = config;
