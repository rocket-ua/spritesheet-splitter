const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path');

module.exports = {
    entry: './src/AppTest.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'docs'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        /*alias: {
            Base: path.resolve(__dirname, '../../slot-template/src/'),
            Engine: path.resolve(__dirname, '../../../game-engine/src/')
        },*/
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        modules: [
            path.resolve(__dirname, './node_modules/'),
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'docs'),
        compress: true,
        port: 9010
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
