var debug = process.env.NODE_ENV !== 'production'
var webpack = require('webpack')
var fs = require('fs')
var path = require('path')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // eslint-disable-line
var HappyPack = require('happypack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

var PACKAGE = require('./package.json')
var banner = PACKAGE.name + ' - ' + PACKAGE.version

const babelSettings = JSON.parse(fs.readFileSync('.babelrc'))

if (process.env.NODE_ENV === 'production') {
  babelSettings.plugins.push('transform-react-inline-elements')
  babelSettings.plugins.push('transform-react-constant-elements')
}

module.exports = {
  context: path.join(__dirname, `${PACKAGE.appUrlPath}`),
  devtool: debug ? 'inline-sourcemap' : '(none)',
  entry: './js/client.js',
  performance: { hints: false },
  optimization: {
    minimizer: debug ? [] : [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            dead_code: true
          },
          output: {
            comments: '/^! NAITS.*/',
            beautify: false
          }
        }
      })
    ]
  },
  resolve: {
    modules: [ // dont use relative paths for imports
      path.resolve(`./${PACKAGE.appUrlPath}/js`),
      path.resolve('./node_modules')
    ],
    alias: {
      'tibro-components': 'perun-components',
      'tibro-redux': 'perun-redux'
    }
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        include: [/perun-redux/, /perun-components/, /tibro-redux/, /tibro-components/]
      },
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'happypack/loader'
      },
      // {
      //   test: /\.module.scss$/,
      //   use: [
      //     'style-loader?sourceMap',
      //     {
      //       loader: 'css-loader?modules',
      //       options: {
      //         modules: true,
      //         importLoaders: 0,
      //         localIdentName: '[path][name]-[local]',
      //         url: false,
      //         alias: {
      //           'img': path.resolve(__dirname, `/${PACKAGE.appUrlPath}/img`)
      //         }
      //       }
      //     },
      //     {
      //       loader: 'sass-loader?sourceMap' // compiles Sass to CSS
      //     }
      //   ]
      // },
      {
        test: /\.module.css$/,
        use: [
          'style-loader?sourceMap',
          {
            loader: 'css-loader?modules',
            options: {
              modules: true,
              importLoaders: 0,
              localIdentName: '[path][name]-[local]',
              url: false,
              alias: {
                'img': path.resolve(__dirname, `/${PACKAGE.appUrlPath}/img`)
              }
            }
          }
        ]
      },
      {
        test: /^((?!\.module).)*css$/,
        use: [
          'style-loader?sourceMap',
          {
            loader: 'css-loader?modules',
            options: {
              modules: false,
              importLoaders: 0,
              localIdentName: '[path].[name]_classname-[local]-[hash:base64:5]'
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  externals: [
    {
      './cptable': 'var cptable'
    }
  ],
  output: {
    path: path.resolve(__dirname, `${PACKAGE.appUrlPath}`),
    publicPath: `/${PACKAGE.appUrlPath}/`,
    filename: debug ? `${PACKAGE.name.toLowerCase()}.js` : `${PACKAGE.name.toLowerCase()}_[chunkhash]_${PACKAGE.version}.js`
  },
  plugins: debug ? [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'js/index.template.html',
      // this line is needed to move dev bundle from memory to hdd
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new HappyPack({
      loaders: ['babel-loader?cacheDirectory']
    }),
    new webpack.DefinePlugin({
      appUrlPath: JSON.stringify(PACKAGE.appUrlPath),
      naitsVersion: JSON.stringify(banner)
    })
  ] : [
    // new BundleAnalyzerPlugin(),
    // this line is for webpack to ignore locales from moment package
    new webpack.DefinePlugin({
      appUrlPath: JSON.stringify(PACKAGE.appUrlPath),
      naitsVersion: JSON.stringify(banner),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /mk/), // eslint-disable-line
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'js/index.template.html'
    }),
    new webpack.BannerPlugin(banner),
    new HappyPack({
      loaders: ['babel-loader?cacheDirectory']
    })
  ]
}
