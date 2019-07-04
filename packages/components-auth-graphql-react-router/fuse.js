const {
  FuseBox,
  JSONPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  ImageBase64Plugin,
  EnvPlugin,
  WebIndexPlugin
} = require('fuse-box');

const { registerRoutes } = require('@toryjs/express-api');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const fuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js',
  target: 'browser',
  sourceMaps: true,
  plugins: [
    ImageBase64Plugin(),
    JSONPlugin(),
    EnvPlugin({ NODE_ENV: 'development' }),
    [CSSResourcePlugin(), CSSPlugin()],
    WebIndexPlugin({ template: 'src/catalogue/browser.html', target: 'index.html' })
  ]
});

fuse.dev(
  {
    fallback: 'index.html',
    port: 9001,
    root: false
  },
  server => {
    const dist = path.resolve('./public');
    const app = server.httpServer.app;
    app.use(bodyParser.json());
    registerRoutes(app, false);
    app.use('/', express.static(dist));
    app.get('*', function(req, res) {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }
);

fuse
  .bundle('luis-vendor')
  .hmr()
  .instructions(` ~ browser.tsx`);

fuse
  .bundle('luis-client')
  .watch() // watch only client related code
  .hmr()
  .sourceMaps(true)
  .instructions(`> [browser.tsx]`);

fuse.run();
