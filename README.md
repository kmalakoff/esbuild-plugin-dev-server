# esbuild-plugin-dev-server

Dev server for esbuild with live reload and an error overlay.

## Installation

```sh
npm install esbuild esbuild-plugin-dev-server
```

Run this in an esbuild project that has `src/index.js` and `public/index.html`:

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

The plugin serves `public` on port 3000 and displays build errors in the browser. When used with an esbuild watch or rebuild workflow, it reloads clients after builds. The example above performs one build. Pass `public` and `port` to change the directory or port.

## Examples

![glyph](https://media.giphy.com/media/MQ582WuZaCyAHfoNwx/giphy.gif)

- [express](https://github.com/kmalakoff/esbuild-plugin-dev-server/tree/master/examples/express)
- [electron](https://github.com/kmalakoff/esbuild-plugin-dev-server/tree/master/examples/electron)
- [plugin](https://github.com/kmalakoff/esbuild-plugin-dev-server/tree/master/examples/plugin)

## License

MIT
