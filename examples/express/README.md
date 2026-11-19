# Express example

Serves a React page from your own express server on port 8001 and reloads it after every esbuild rebuild. It uses the plugin's `client` and `socketServer` exports with `esbuild.context().watch()`. The example imports the plugin from the repository's built output.

```sh
# in the repository root
npm install
npm run build

# in this directory
npm install
npm start
```

Open http://localhost:8001, then edit `client.tsx`: the page reloads. Stop the server with Ctrl+C.

The error overlay's "open in editor" button is served by `editorMiddleware.mjs`, a small copy of the plugin's own handler built on `launch-editor`. Set `REACT_EDITOR` to choose the editor, or `REACT_EDITOR=none` to turn it off.
