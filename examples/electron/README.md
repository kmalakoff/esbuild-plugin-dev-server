# Electron example

An Electron window that loads a React renderer bundled by esbuild. `npm start` serves the renderer on port 3000 with live reload through the dev-server plugin and restarts Electron when the main process changes. `npm run build` writes a production build to `app/`. The example imports the plugin from the repository's built output.

```sh
# in the repository root
npm install
npm run build

# in this directory
npm install
npm start
```

Quit with Ctrl+C in the terminal. `npm run release` packages the app with electron-builder.

The first `npm start` downloads the Electron binary (about 260 MB); Electron needs Node 22.12 or newer.
