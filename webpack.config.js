const path = require('path'),
  {CleanWebpackPlugin} = require('clean-webpack-plugin'),
  HTMLWebpackPlugin = require('html-webpack-plugin'),
  CopyPlugin = require('copy-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production',  /* Определяем в каком режиме сборке мы сейчас находимся */
  isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext};`

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),  /* указывает где лежат все исходники приложения */
  mode: 'development',  /* режим, в котором webpack будет работать */
  entry: './index.js', /* входная точка для сборки проекта */
  output: {
    filename: filename('js'),  /* название файла, получаемого на выходе */
    path: path.resolve(__dirname, 'dist') /* путь, куда этот файл будет положен */
  },
  resolve: {
    extensions: ['.js'],
    /* import '../../../core/Component' */
    /* import '@core/Component' */
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core')
    }
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd, /* if проект собран в prod режиме - минифицируем файлы */
        collapseWhitespace: isProd /* if проект собран в prod режиме - минифицируем файлы */
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [ /* ВАЖНО: считывание модулей происходит справа-налево(снизу-вверх)!!! */
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // hmr: isDev,
              // reloadAll: true
            }
          },
          /* Translates CSS into CommonJS */
          'css-loader',
          /* Compiles Sass to CSS */
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      }
    ]
  }
}