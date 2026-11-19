#!/usr/bin/env node

import electronmon from 'electronmon';
import esbuild from 'esbuild';
import fs from 'fs/promises';
import inline from 'html-inline-external';
import path from 'path';
import url from 'url';
import devServer from '../../dist/esm/index.js'; // esbuild-plugin-dev-server (built output)

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const isServing = process.argv[2] === 'serve';

(async () => {
  await fs.rm('app', { recursive: true, force: true });
  await fs.mkdir('app');

  // main
  const main = await esbuild.context({
    platform: 'node',
    bundle: true,
    minify: !isServing,
    entryPoints: ['src/main/index.ts'],
    outfile: 'app/main.js',
    plugins: [
      {
        name: 'make-all-packages-external',
        setup(build) {
          build.onResolve({ filter: /^[^./]|^\.[^./]|^\.\.[^/]/ }, (args) => ({ path: args.path, external: true }));
        },
      },
    ],
  });
  if (isServing) await main.watch();
  else {
    await main.rebuild();
    await main.dispose();
  }

  // renderer
  const renderer = await esbuild.context({
    target: 'chrome100',
    bundle: true,
    minify: !isServing,
    entryPoints: ['src/renderer/index.tsx'],
    outfile: 'app/renderer.js',
    publicPath: isServing ? '/' : '',
    plugins: [isServing && devServer({ public: 'app', port: 3000 })].filter(Boolean),
  });
  if (isServing) await renderer.watch();
  else {
    await renderer.rebuild();
    await renderer.dispose();
  }
  await fs.copyFile('src/renderer/index.html', 'app/index.html');
  if (!isServing) {
    const html = await inline({ src: 'app/index.html' });
    fs.writeFile('app/index.html', html, 'utf8');
  }

  // launch electron
  if (isServing) electronmon({ cwd: path.join(__dirname, 'app'), args: ['main.js'] });
})();
