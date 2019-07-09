const {
  FuseBox,
  JSONPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  ImageBase64Plugin,
  EnvPlugin,
  WebIndexPlugin
} = require('fuse-box');

const SnapshotPlugin = require('luis/fuse-box/snapshot-plugin').SnapshotPlugin;

const luisFuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js',
  target: 'browser',
  sourceMaps: true,
  plugins: [
    SnapshotPlugin(),
    ImageBase64Plugin(),
    JSONPlugin(),
    EnvPlugin({ NODE_ENV: 'test' }),
    [CSSResourcePlugin(), CSSPlugin()],
    WebIndexPlugin({ template: 'luis.fuse.html', target: 'index.html' })
  ]
});

luisFuse.dev({
  fallback: 'index.html',
  port: 9001
});

luisFuse
  .bundle('luis-vendor')
  .hmr()
  .instructions(` ~ luis_app.ts ~ **/*.test.*`); // nothing has changed here

luisFuse
  .bundle('luis-client')
  .watch() // watch only client related code
  .hmr()
  .sourceMaps(true)
  .instructions(`> [luis_app.ts] + [**/*.test.*]`);

luisFuse.run();
