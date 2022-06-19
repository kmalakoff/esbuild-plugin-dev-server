#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import esbuild from 'esbuild';
import devServer from 'esbuild-plugin-dev-server';
import { inlineSource } from 'inline-source';

import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;
const isServing = process.argv[2] === 'serve';

(async () => {
  await fs.rm('app', { recursive: true, force: true });
  await fs.mkdir('app');

  // main
  await esbuild.build({
    platform: 'node',
    bundle: true,
    watch: isServing,
    entryPoints: ['src/main/index.ts'],
    outfile: 'app/main.js',
    plugins: [
      {
        name: 'make-all-packages-external',
        setup(build) {
          let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
          build.onResolve({ filter }, (args) => ({ path: args.path, external: true }));
        },
      },
    ],
  });

  // renderer
  await esbuild.build({
    target: 'chrome100',
    bundle: true,
    watch: isServing,
    entryPoints: ['src/renderer/index.tsx'],
    outfile: 'app/renderer.js',
    publicPath: '/',
    plugins: [isServing && devServer({ public: 'app', port: 3000 })].filter(Boolean),
  });
  await fs.copyFile('src/renderer/index.html', 'app/index.html');
  if (!isServing) {
    // inline js
    const html = await inlineSource('app/index.html', { compress: true, rootpath: path.join(__dirname, 'app') });
    fs.writeFile('app/index.html', html, 'utf8');
  }

  // launch electron
  if (isServing) exec(`electron ${path.join(__dirname, 'app', 'main.js')}`);
})();
