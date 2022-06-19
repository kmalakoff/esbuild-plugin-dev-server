## esbuild-plugin-dev-server

Dev server for esbuild with live reload and error overlay.

```javascript
const esbuild = require('esbuild');
const devServer = require('esbuild-plugin-dev-server');

esbuild.build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: './public/bundle.js',
  plugins: [devServer({ public: './public', port: 3000 })],
});
```

## Examples

![glyph](https://media.giphy.com/media/MQ582WuZaCyAHfoNwx/giphy.gif)

- [express](https://github.com/kmalakoff/esbuild-plugin-dev-server/tree/master/examples/express)
- [electron](https://github.com/kmalakoff/esbuild-plugin-dev-server/tree/master/electron)
- [plugin](https://github.com/kmalakoff/esbuild-plugin-dev-server/tree/master/plugin)
