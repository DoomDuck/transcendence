# Webpack

Webpack is a bundler, a program that provides a way
to transpile, transform then compile multiple objects (ts, js, html, css)
in independant packages.

## Concepts

- Entries
> Roots of dependency graph

- Outputs
> Build results

- Loaders
> Support file types typescript, svelte...

- Plugins
> Can modifie how the bundle is created in many ways

- Modes
> List of build profiles (development, production, ...)

- Browser compatibiliy
> It is possible to generate old js supported everywhere from recent code


## Webpack config structure

The file must be in `webpack.config.js` and look like

```js
import HtmlPlugin = require('html-webpack-plugin');

module.export = {
  entry: {
    main: './path/to/entry.js',
  }

  output: {
    filename: 'bundle.js'
  },
  
  module: {
    rules: [{ test: /.txt$/, use: 'raw-loader'}],
  },
  
  plugins: [new HtmlPlugin({template: './src/index.html'})],
  
  mode: 'production',
};
```

This config file and every entry is optional as they have defaults


