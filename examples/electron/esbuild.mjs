#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import esbuild from 'esbuild';
import devServer from '../../lib/index.js'; // esbuild-plugin-dev-server
import inline from 'html-inline-external';
import electronmon from 'electronmon';

import url from 'url';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const isServing = process.argv[2] === 'serve';

(async () => {
  await fs.rm('app', { recursive: true, force: true });
  await fs.mkdir('app');

  // main
  await esbuild.build({
    platform: 'node',
    bundle: true,
    minify: !isServing,
    watch: isServing,
    entryPoints: ['src/main/index.ts'],
    outfile: 'app/main.js',
    plugins: [
      {
        name: 'make-all-packages-external',
        setup(build) {
          build.onResolve({ filter: /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ }, (args) => ({ path: args.path, external: true }));
        },
      },
    ],
  });

  // renderer
  await esbuild.build({
    target: 'chrome100',
    bundle: true,
    minify: !isServing,
    watch: isServing,
    entryPoints: ['src/renderer/index.tsx'],
    outfile: 'app/renderer.js',
    publicPath: isServing ? '/' : '',
    plugins: [isServing && devServer({ public: 'app', port: 3000 })].filter(Boolean),
  });
  await fs.copyFile('src/renderer/index.html', 'app/index.html');
  if (!isServing) {
    const html = await inline({ src: 'app/index.html' });
    fs.writeFile('app/index.html', html, 'utf8');
  }

  // launch electron
  if (isServing) electronmon({ cwd: path.join(__dirname, 'app'), args: ['main.js'] });
})();
