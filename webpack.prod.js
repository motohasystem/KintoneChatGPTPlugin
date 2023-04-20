
const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const StatsPlugin = require('stats-webpack-plugin');

// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = "production";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
    mode: MODE,

    entry: {
        // mobile: './src/js/mobile.js',
        config: './src/ts/config/main.ts',
        desktop: "./src/ts/desktop/main.ts"
    },
    output: {
        path: path.resolve(__dirname, 'plugin', 'js'),
        filename: '[name].js'
    },
    // devtool: 'inline-source-map',
    devtool: "hidden-source-map",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/, 
                loader: 'babel-loader', 
                exclude: /node_modules/ 
            }
            , {
                test:  /\.s[ac]ss$/i,
                use: [
                    // linkタグに出力する機能
                    "style-loader",
                    // CSSをバンドルするための機能
                    {
                        loader: "css-loader",
                        options: {
                            // オプションでCSS内のurl()メソッドの取り込みを禁止する
                            url: false,
                            // ソースマップの利用有無
                            sourceMap: enabledSourceMap,

                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                            importLoaders: 2
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            // ソースマップの利用有無
                            sourceMap: enabledSourceMap
                        },
                    },
                ]
            }
        ],
    },
    plugins: [
        new KintonePlugin({
            manifestJSONPath: './plugin/manifest.json',
            privateKeyPath: './private_prod.ppk',
            pluginZipPath: './dist/ChatGptPlugin.zip'
        })
        , new ForkTsCheckerWebpackPlugin()
        , new TerserPlugin({
            terserOptions: {
                compress: { drop_console: true }   // true: console.log()を削除
            }
        })
        , new StatsPlugin('stats.json', {
            chunkModules: true,
        })
    ],
    cache: true,
    watchOptions: {
        poll: true
    }

};
