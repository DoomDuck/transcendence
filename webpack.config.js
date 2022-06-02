const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const svelte_preprocess = require('svelte-preprocess');

module.exports = {
  entry: "./src/front/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "./bundle.js",
  },
  mode: "production",

  resolve: {
    // Prevent multiple Svelte copies
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte', '.ts'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },

  module: {
    rules: [
      {
          test: /\.ts$/,
          use: 'ts-loader',
      },
      {
        test: /\.(html|svelte)$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            preprocess: svelte_preprocess({}),
          }
        },
      },
      {
        // Required to prevent errors from Svelte on Wepback 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // options necessary to use url('/path/to/some/asset.png|jpg|gif')
          { loader: 'css-loader', options: { url: false } },
        ]
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
  ]
};
