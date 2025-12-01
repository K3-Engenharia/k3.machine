const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    mode: argv.mode || 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash].js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: {
        "process": require.resolve("process/browser")
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new Dotenv({
        path: isDevelopment ? './.env.development' : './.env',
        safe: true,
        systemvars: true,
        silent: true,
        defaults: false,
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      port: 3000,
      historyApiFallback: true,
      open: true,
    },
  };
};