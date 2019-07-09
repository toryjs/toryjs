# Installation

We do not enforce any modules and as a result you need to install them specifically for your project. We assume that most modules already exist in your project.

```
yarn add mobx mobx-react mobx-state-tree mst-middlewares react react-dom
yarn add dynamic-form-semantic-ui
```

# Cosmos

.babelrc

```
{
  "presets": ["@babel/env", "@babel/preset-typescript", "@babel/react"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/proposal-object-rest-spread"
  ]
}
```

packages

```
yarn add @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader style-loader css-loader html-webpack-plugin @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/proposal-object-rest-spread
```

cosmos.config.js

```
module.exports = {
  next: true,
  rootPath: './src',
  globalImports: ['semantic-ui-css/semantic.min.css'],
  webpack: (config, { env }) => {
    // Return customized config
    return {
      ...config,
      resolve: {
        extensions: [...config.resolve.extensions, '.ts', '.tsx']
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.tsx?$/,
            loader: 'babel-loader'
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg|jpg|png)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'file-loader'
              }
            ]
          }
          // {
          //   test: /\.js$/,
          //   use: ['source-map-loader'],
          //   enforce: 'pre'
          // }
        ]
      }
    };
  }
};
```
