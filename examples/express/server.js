import esbuild from 'esbuild';
import express from 'express';
import { createServer } from 'http';
import { socketServer, client } from '../../index.js';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware.js';
import open from 'open';

const app = express({ strict: false });
app.use(errorOverlayMiddleware());
app.use(express.static('public'));
const server = createServer(app);
const write = socketServer(server);
server.listen(8001);

esbuild.build({
  entryPoints: ['src/client.tsx'],
  bundle: true,
  outfile: 'public/js/bundle.js',
  banner: { js: client },
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
