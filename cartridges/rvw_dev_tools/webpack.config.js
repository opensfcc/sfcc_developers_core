const webpack = require('webpack');
const {VueLoaderPlugin} = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

function getPlugins(mode, argv) {
    return [
        new webpack.ProgressPlugin(),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin({verbose: true}),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                PACKAGE_VERSION: '"' + version + '"',
                IS_DEVELOPMENT: argv.mode === 'development'
            },
        })
    ];
}

module.exports = (mode, argv) => {
    const config = {
        performance: {
            hints: false
        },
        entry: {
            dev_tools: [
                __dirname + '/cartridge/client/default/js/dev_tools.js',
                __dirname + '/cartridge/client/default/scss/dev_tools.scss',
            ],
        },
        output: {
            filename: 'js/[name].js',
            path: __dirname + '/cartridge/static/default'
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
                    use: [
                        MiniCssExtractPlugin.loader,
                        {loader: 'css-loader', options: {url: false, sourceMap: argv.mode === 'development'}},
                        {loader: 'sass-loader', options: {sourceMap: argv.mode === 'development'}}
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
        plugins: getPlugins(mode, argv)
    };

    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};
