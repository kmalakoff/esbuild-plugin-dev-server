import esbuild from 'esbuild';
import express from 'express';
import { createServer } from 'http';
import open from 'open';
import editorMiddleware from './editorMiddleware.mjs';
import { client, socketServer } from '../../dist/esm/index.js'; // esbuild-plugin-dev-server (built output)

const app = express({ strict: false });
app.use(editorMiddleware);
app.use(express.static('public'));
const server = createServer(app);
const write = socketServer(server);
server.listen(8001);

(async () => {
  const context = await esbuild.context({
    entryPoints: ['client.tsx'],
    bundle: true,
    outfile: 'public/js/bundle.js',
    banner: { js: client() },
    plugins: [
      {
        name: 'build',
        setup: (build) => build.onEnd(write),
      },
    ],
  });

  await context.watch();
  open('http://localhost:8001');
})();
