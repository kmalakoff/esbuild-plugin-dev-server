# Dev server plugin example

Bundles a React page with esbuild and serves it from `public/` on port 8000 through the `esbuild-plugin-dev-server` plugin. The example imports the plugin from the repository's built output.

```sh
# in the repository root
npm install
npm run build

# in this directory
npm install
npm start
```

Open http://localhost:8000. Stop the server with Ctrl+C.
