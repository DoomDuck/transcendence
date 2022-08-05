const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  
  // bundle files from node_modules
  externals: [],
  
  target: 'node',
  
  mode: 'development',
  
  output: {
    path: path.resolve(__dirname, "build/"),
    filename: "./bundle.js",
  },
  
  resolve: {
    extensions: [".ts", ".js"],
    mainFields: ['module', 'main', 'browser'],
  },

  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
    }],
  }
};
