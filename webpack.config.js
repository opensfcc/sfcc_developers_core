const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyPlugin = require('copy-webpack-plugin');

function getPlugins() {
    return [
        new webpack.ProgressPlugin(),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin({verbose: true}),
        new CopyPlugin({
            patterns: [
                {
                    from: __dirname + '/cartridges/rvw_dev_console/cartridge/scripts/stubs',
                    to  :  __dirname + '/cartridges/rvw_dev_console/cartridge/static/default/stubs'
                }
            ]
        }, {
            copyUnmodified: true
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ];
}

module.exports = (mode, argv) => {
    const config = {
        entry: {
            dev_console: [
                __dirname + '/cartridges/rvw_dev_console/cartridge/client/default/js/dev_console.js',
                __dirname + '/cartridges/rvw_dev_console/cartridge/client/default/scss/dev_console.scss',
            ],
        },
        output: {
            filename: 'js/[name].js',
            path: __dirname + '/cartridges/rvw_dev_console/cartridge/static/default'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use : [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { url: false, sourceMap: mode === 'development' } },
                        { loader: 'sass-loader', options: { sourceMap: mode === 'development' } }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.vue'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
            }
        },
        plugins: getPlugins()
    };

    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};
