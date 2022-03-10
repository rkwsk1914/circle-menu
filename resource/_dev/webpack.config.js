//ファイル名
const jsName = 'main';
const cssName = 'style';

//画像圧縮用のプラグイン
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');

//webpac-bundle-analyzerを読み込んでおく
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

//バンドルしたJSからCSSを抽出
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//CSS圧縮
//const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

//console.log()を削除するため TerserPluginを使用
const TerserPlugin = require('terser-webpack-plugin');

// output.pathに指定するパスがOSによって異なることを
// 防ぐためにpathモジュールを読み込んでおく
const path = require('path');

module.exports = (env) => {
  const MODE = env.production === true ? 'production' : 'development';
  console.log('mode =>', MODE);
  const CONFIG = {
    // モードの設定（ モードを指定しないとwebpack実行時に警告が出る）
    //また、productionにすれば、ファイルの圧縮や、モジュールの最適化などの設定が有効になるため、 
    //本番時のファイルの出力には、こちらのモードを利用します。
    mode: MODE,
    // エントリーポイントの設定
    //エントリー ポイントとは、モジュール間の依存関係の解析を開始するファイルのことです。
    //各モジュールを読み込んでメインの処理をするJavaScriptファイルだと認識しておけば問題ありません。
    entry: {
      shared: `./src/js/shared/${jsName}.js`,
      //p: `./src/js/p/${jsName}.js`,
      //s: `./src/js/s/${jsName}.js`
    },
    //出力の設定
    //出力するファイル名や出力先など、出力に関する設定ができます。
    output: {
      // 出力するファイル名 
      filename: `js/[name]/${jsName}.min.js`,
      // 出力先のパス（ 絶対パスを指定しないとエラーが出るので注意） 
      path: path.resolve(__dirname, '../')
    },
    //ローダーの設定
    module: {
      rules: [
        /* ----------------------------------------------------------------
          JavaScriptのコンパイル
        ----------------------------------------------------------------- */
        {
          //ローダーの処理対象ファイル
          test: /\.js$/,
          //ローダーの処理対象となるディレクトリ
          include: path.resolve(__dirname, 'src/js'),
          exclude: /node_modules/,
          //記述とは逆順に実行されるので注意！
          use: [
            {
              //利用するローダー
              loader: 'babel-loader',
              //ローダーのオプション
              options: {
                "presets": ["@babel/preset-env", "@babel/preset-react"]
              }
            },
            //ESLintによるコード解析
            {
              loader: 'eslint-loader',
              options: {
                //fix： autofixモードを有効化（できるだけ多くの問題を修復）
                fix: false,
                //ESLintによるエラー検出時にはビルドを中断
                failOnError: true,
              }
            }
          ]
        },
        /* ----------------------------------------------------------------
          JSXのコンパイル
        ----------------------------------------------------------------- */
        {
          //ローダーの処理対象ファイル
          test: /\.jsx$/,
          //ローダーの処理対象となるディレクトリ
          include: path.resolve(__dirname, 'src/js'),
          exclude: /node_modules/,
          //記述とは逆順に実行されるので注意！
          use: [
            {
              //利用するローダー
              loader: 'babel-loader',
              //ローダーのオプション
              options: {
                "presets": ["@babel/preset-env", "@babel/preset-react"]
              }
            },
            //ESLintによるコード解析
            {
              loader: 'eslint-loader',
              options: {
                //fix： autofixモードを有効化（できるだけ多くの問題を修復）
                fix: false,
                //ESLintによるエラー検出時にはビルドを中断
                failOnError: true,
              }
            }
          ]
        },
        /* ----------------------------------------------------------------
          TypeScriptのコンパイル
        ----------------------------------------------------------------- */
        {
          test: /\.ts$/,
          use: [
            {
              //利用するローダー
              loader: 'babel-loader',
              //ローダーのオプション
              options: {
                "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/typescript"],
                "plugins": ["@babel/proposal-class-properties", "@babel/proposal-object-rest-spread"]
              }
            },
            {
              loader: 'ts-loader'
            },
            //ESLintによるコード解析
            {
              loader: 'eslint-loader',
              options: {
                //fix： autofixモードを有効化（できるだけ多くの問題を修復）
                fix: false,
                //ESLintによるエラー検出時にはビルドを中断
                failOnError: true,
              }
            }
          ]
        },
        /* ----------------------------------------------------------------
          TSXのコンパイル
        ----------------------------------------------------------------- */
        {
          test: /\.tsx$/,
          use: [
            {
              //利用するローダー
              loader: 'babel-loader',
              //ローダーのオプション
              options: {
                "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/typescript"],
                "plugins": ["@babel/proposal-class-properties", "@babel/proposal-object-rest-spread"]
              }
            },
            {
              loader: 'ts-loader'
            },
            //ESLintによるコード解析
            {
              loader: 'eslint-loader',
              options: {
                //fix： autofixモードを有効化（できるだけ多くの問題を修復）
                fix: false,
                //ESLintによるエラー検出時にはビルドを中断
                failOnError: true,
              }
            }
          ]
        },
        /* ----------------------------------------------------------------
          CSSファイルの読み込みとコンパイル
        ----------------------------------------------------------------- */
        {
          // 対象となるファイルの拡張子
          test: /\.css/,
          // Sassファイルの読み込みとコンパイル
          use: [
            // CSSファイルを書き出すオプションを有効にする
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // linkタグに出力する機能
            //"style-loader",
            // CSSをバンドルするための機能
            {
              loader: "css-loader",
              options: {
                // CSS内のurl()メソッドの取り込みを禁止する
                url: false,
                // ソースマップの利用有無
                sourceMap: true,
                // Sass+PostCSSの場合は2を指定
                importLoaders: 2,
              },
            },
            // PostCSSのための設定
            {
              loader: "postcss-loader",
              options: {
                // PostCSS側でもソースマップを有効にする
                // sourceMap: true,
                postcssOptions: {
                  plugins: [
                    //CSS圧縮
                    require('cssnano')({
                      preset: 'default',
                    }),
                    // Autoprefixerを有効化
                    require("autoprefixer")({
                      // ☆IEは11以上、Androidは4.4以上
                      // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
                      browsers: ["last 2 versions", "ie >= 11", "Android >= 4"]
                    })
                  ],
                },
              },
            },
          ],
        },
        /* ----------------------------------------------------------------
          Sassファイルの読み込みとコンパイル
        ----------------------------------------------------------------- */
        {
          // 対象となるファイルの拡張子
          test: /\.scss/,
          // Sassファイルの読み込みとコンパイル
          use: [
            // CSSファイルを書き出すオプションを有効にする
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // linkタグに出力する機能
            //"style-loader",
            // CSSをバンドルするための機能
            {
              loader: "css-loader",
              options: {
                // CSS内のurl()メソッドの取り込みを禁止する
                url: false,
                // ソースマップの利用有無
                sourceMap: true,
                // Sass+PostCSSの場合は2を指定
                importLoaders: 2,
              },
            },
            // PostCSSのための設定
            {
              loader: "postcss-loader",
              options: {
                // PostCSS側でもソースマップを有効にする
                // sourceMap: true,
                postcssOptions: {
                  plugins: [
                    // Autoprefixerを有効化
                    require("autoprefixer")({
                      // ☆IEは11以上、Androidは4.4以上
                      // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
                      browsers: ["last 2 versions", "ie >= 11", "Android >= 4"]
                    })
                  ],
                },
              },
            },
            // Sassをバンドルするための機能
            {
              loader: "sass-loader",
              options: {
                // ソースマップの利用有無
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    // ES5(IE11等)向けの指定（webpack 5以上で必要）
    target: ["web", "es5"],
    //インポート時に認識する拡張子
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js', '.json']
    },
    //プラグインの追加
    plugins: [
      /* ----------------------------------------------------------------
      image画像圧縮
      ----------------------------------------------------------------- */
      //a.CopyWebpackPlugin の有効化
      //fromからtoへコピーを設定する
      new CopyPlugin({
        patterns: [{
          from: 'src/img',
          to: 'img'
        }],
      }),
      //b.CopyWebpackPlugin の有効化
      //testパラメータは、圧縮対象ファイルを意味する
      //plugquant(png), gifsicle(gif), svgo(svg), ImageMozjpeg(jpg)で画像の設定
      // quality: 品質の度合い0~100で指定 0が最低
      // interLaced: プログレッシブレンダリングを有効にするか（既定はfalse）
      //             ※プログレッシブレンダリングは低解像度で（荒く）表示し、徐々に高解像度で表示する
      //               無効の場合、画像は上から徐々に読み込まれる
      // colors: GIFの色数（2～256で設定）
      // progressive： プログレッシブレンダリングを有効にするか（既定はtrue）
      new ImageminPlugin({
        test: /\.(png|jpe?g|gif|svg)$/i,
        //pngの設定
        pngquant: {
          quality: '70-80'
        },
        //gifの設定
        gifsicle: {
          optimizationLevel: 1,
          colors: 256
        },
        //svgの設定
        svgo: {},
        plugins: [
          //jpegの設定
          ImageminMozjpeg({
            quality: 80,
            progressive: false
          })
        ]
      }),
      /* ----------------------------------------------------------------
      ファイル容量分析
      ----------------------------------------------------------------- */
      //webpack-bundle-analyzerを利用する
      //new BundleAnalyzerPlugin(),
      /* ----------------------------------------------------------------
      css圧縮
      ----------------------------------------------------------------- */
      //CSS抽出
      new MiniCssExtractPlugin({
        filename: `css/[name]/${cssName}.css`,
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: { comments: MODE === "production" ? false : true },
            compress: { drop_console: MODE === "production" ? true : false }
          }
        }),
        //new OptimizeCSSAssetsPlugin({})],
      ]
    },
  };
  //ソースマップの設定
  if (MODE === 'development') {
    CONFIG.devtool = 'eval-source-map';
  }
  return CONFIG;
};