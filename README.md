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
