const path = require("path");

module.exports = {
  entry: "./src/index.js",
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
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },

  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        use: 'svelte-loader'
      },
      {
        // Required to prevent errors from Svelte on Wepback 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        }
      },
    ]
  },
};
