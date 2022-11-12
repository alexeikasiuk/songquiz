const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    entry: ['./src/script.js', './src/sass/style.scss'],
    output: {
      filename: 'script.js',
      path: path.join(__dirname, '/dist'),
      clean: true,
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    devServer: {
      static: './dist',
      hot: true,
      watchFiles: ['*'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      new HtmlWebpackPlugin({
        title: 'songbird',
        template: 'index.html',
        scriptLoading: 'blocking',
        favicon: path.join(__dirname, 'src', 'assets', 'images', 'favicon.ico'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.scss/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(mp3|mp4|wav|woff|woff2|eot|ttf|otf|png|svg|jpg|jpeg|gif)$/,
          type: 'asset',
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
  };
  return config;
};
