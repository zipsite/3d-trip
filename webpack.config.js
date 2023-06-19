const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { webpack } = require('webpack');

module.exports = {
    entry: {
        js: path.join(__dirname, 'src/js', 'app.js'),
    },
    output: {
        filename: '[name]/app.[name]',
        path: path.resolve(__dirname, './public/access/'),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Каталог для статики
        },
        open: true,
        port: 9000
    },
};