import esbuild from 'esbuild';
import express from 'express';
import { createServer } from 'http';
import open from 'open';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware.js';
import { client, socketServer } from '../../lib/index.js'; // esbuild-plugin-dev-server

const app = express({ strict: false });
app.use(errorOverlayMiddleware());
app.use(express.static('public'));
const server = createServer(app);
const write = socketServer(server);
server.listen(8001);

(async () => {
  await esbuild.build({
    entryPoints: ['client.tsx'],
    bundle: true,
    outfile: 'public/js/bundle.js',
    banner: { js: client() },
    watch: true,
    incremental: true,
    plugins: [
      {
        name: 'build',
        setup: (build) => build.onEnd(write),
      },
    ],
  });

  open('http://localhost:8001');
})();
