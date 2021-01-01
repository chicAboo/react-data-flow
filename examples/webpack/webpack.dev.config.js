process.env.NODE_ENV = 'development';

const os = require('os');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HappyPack = require('happypack');
const openBrowser = require('react-dev-utils/openBrowser');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const WebpackBar = require('webpackbar');
const webpackConfig = require('./config');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const babelConfig = JSON.parse(fs.readFileSync(path.resolve('./.babelrc'), 'utf-8').toString());

if (!webpackConfig.supportIE) {
  babelConfig.plugins.push([
    '@babel/plugin-transform-runtime',
    {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: false,
    },
  ]);
}

// style files regexes
const sassRegex = /\.(scss|sass)$/;
const sassGlobalRegex = /\.global\.(scss|sass)$/;

const srcPath = path.resolve('./', 'src');

const pathAlias = {
  // '@': srcPath,
  '@': path.resolve('./', 'src/a/'),
  'react-dom': '@hot-loader/react-dom',
};

const ieCompileModule = [
  path.resolve('node_modules/chalk'),
  path.resolve('node_modules/ansi-styles'),
  path.resolve('node_modules/error-overlay-webpack-plugin'),
  path.resolve('node_modules/react-dev-utils'),
  path.resolve('node_modules/debug'),
];

module.exports = {
  devServer: {
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: webpackConfig.port,
    publicPath: webpackConfig.publicPath,
    contentBase: './',
    host: '0.0.0.0',
    overlay: false,
    public: 'http://' + require('ip').address() + ':' + webpackConfig.port,
    open: false,
    quiet: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    after: function (app, server) {
      if (openBrowser('http://localhost:' + webpackConfig.port)) {
        console.log('The browser tab has been opened!');
      }
    },
    proxy: {},
  },
  mode: 'development',
  entry: {
    main: ['./src/index.tsx'],
  },
  output: {
    pathinfo: true,
    publicPath: webpackConfig.publicPath,
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/[name].js',
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: pathAlias,
    modules: [srcPath, 'node_modules'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [srcPath].concat(webpackConfig.supportIE ? ieCompileModule : []),
        use: ['happypack/loader?id=happyBabel'],
      },
      {
        test: /\.(ts|tsx)$/,
        include: [srcPath],
        use: ['happypack/loader?id=happyBabel'],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: sassRegex,
        exclude: sassGlobalRegex,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              // modules: {
              //   mode: 'local',
              //   localIdentName: '[name]__[local]--[hash:base64:5]',
              // },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: sassGlobalRegex,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]',
              limit: webpackConfig.imgLimit,
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.(jpeg|jpg)$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/images/[name].[ext]',
              limit: webpackConfig.imgLimit,
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  devtool: webpackConfig.devtool,
  optimization: {
    namedModules: true,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
        },
        vendor: {
          // 将第三方模块提取出来
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10, // 优先
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  plugins: [
    new WebpackBar(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        supportIE: JSON.stringify(webpackConfig.supportIE),
        PUBLIC_PATH: JSON.stringify(webpackConfig.publicPath),
      },
    }),
    new ErrorOverlayPlugin(),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['启动成功: http://localhost:' + webpackConfig.port],
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en/),
    new HappyPack({
      id: 'happyBabel',
      loaders: [
        'react-hot-loader/webpack',
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            ...babelConfig,
          },
        },
      ],
      threadPool: happyThreadPool,
    }),
    new HtmlWebpackPlugin({
      title: webpackConfig.appTitle,
      template: './src/public/index.html',
      filename: './index.html',
      favicon: './src/public/favicon.ico',
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          context: './src',
          globOptions: {
            ignore: ['favicon.ico', 'index.html', 'js', 'css', 'js/**/**', 'css/**/**'], // 防止被覆盖
          },
        },
      ],
    }),
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
