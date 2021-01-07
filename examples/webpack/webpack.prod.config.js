process.env.NODE_ENV = 'production';

const os = require('os');
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const WebpackBar = require('webpackbar');
const webpackConfig = require('./config');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// style files regexes
const sassRegex = /\.(scss|sass)$/;
const sassGlobalRegex = /\.global\.(scss|sass)$/;

const srcPath = path.resolve('./', 'src');

const ieCompileModule = [path.resolve('node_modules/debug')];

const pathAlias = {
  '@': srcPath,
  pandora: path.resolve('src/utils/pandora'),
};

const plugins = [
  new WebpackBar(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      supportIE: JSON.stringify(webpackConfig.supportIE),
      PUBLIC_PATH: JSON.stringify(webpackConfig.publicPath),
    },
  }),
  new CaseSensitivePathsPlugin(),
  new CleanWebpackPlugin(),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en/),
  new HappyPack({
    id: 'happyBabel',
    loaders: ['babel-loader?cacheDirectory=true'],
    threadPool: happyThreadPool,
  }),
  new MiniCssExtractPlugin({
    // filename: 'react-data-flow.min.css',
    filename: 'css/[name].[chunkhash].css',
    chunkFilename: 'css/[name].[chunkhash].css',
  }),
  new HtmlWebpackPlugin({
    title: webpackConfig.appTitle,
    template: './src/index.html',
    filename: './index.html',
    favicon: './src/statics/favicon.ico',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  }),
  new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'statics',
        to: '.',
        context: './src',
        globOptions: {
          ignore: ['favicon.ico', 'index.html', 'js', 'css', 'js/**/**', 'css/**/**'], // 防止被覆盖
        },
      },
    ],
  }),
  new FriendlyErrorsWebpackPlugin(),
];

if (webpackConfig.isAnalyzer) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  stats: 'none',
  mode: 'production',
  entry: {
    main: ['./src/index.tsx'],
  },
  output: {
    path: path.resolve('./', webpackConfig.outDirName),
    publicPath: webpackConfig.publicPath,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    devtoolModuleFilenameTemplate: (info) =>
      path.relative(srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: pathAlias,
    modules: [srcPath, 'node_modules'],
  },
  performance: {
    maxAssetSize: 1024 * 500, // 图片建议最大 500kb， 可到 https://tinypng.com 压缩图片
    assetFilter: function (assetFilename) {
      return /\.(jpg|png|gif)$/.test(assetFilename); // 这里只对照片做大小检查，只是警告不影响打包
    },
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: webpackConfig.publicPath,
              hmr: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
            },
          },
          'postcss-loader',
        ],
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      {
        test: sassRegex,
        exclude: sassGlobalRegex,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: webpackConfig.publicPath,
              hmr: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local][hash:base64:6]',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
        sideEffects: true,
      },
      {
        test: sassGlobalRegex,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: webpackConfig.publicPath,
              hmr: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: false,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
        sideEffects: true,
      },
      {
        test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
              limit: webpackConfig.imgLimit,
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.(jpeg|jpg)$/, /\.png$/],
        use: {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[hash:8].[ext]',
            limit: webpackConfig.imgLimit,
            esModules: false,
          },
        },
      },
    ],
  },
  devtool: webpackConfig.devtool,
  optimization: {
    minimize: true,
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
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          exclude: /\.min\.js$/,
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            drop_console: true, // 删除代码中所有的console
            drop_debugger: true, // 删除代码中所有的debugger
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            beautify: false,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: !!webpackConfig.devtool,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: {
            removeAll: true, // 移除注释
          },
        },
      }),
    ],
  },
  plugins: plugins,
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
