const path = require('path');

const entry = './src/client/client_deform.ts';
// const entry = './src/client/client_tween.ts';
// const entry = './src/client/client_physics.ts';

module.exports = {
    entry: entry,
    module: {
        // noParse: [
        //     path.resolve(__dirname, './src/client/client_physics.ts'),
        //     path.resolve(__dirname,'./src/client/client_tween.ts'),
        // ],
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/,
                ],
            },
        ],
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    }
};
