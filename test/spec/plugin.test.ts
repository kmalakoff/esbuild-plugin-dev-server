// @ts-check
import { test } from '@playwright/test';

import assert from 'assert';
import { installSync, removeSync } from 'install-optional';
removeSync('esbuild', '@esbuild/');
installSync('esbuild', `${process.platform}-${process.arch}`);
import esbuild, { type BuildContext } from 'esbuild';

// @ts-ignore
import devServer from 'esbuild-plugin-dev-server';
import { type HttpTerminator, createHttpTerminator } from 'http-terminator';

import path from 'path';
import fs from 'fs-extra';
import { rimraf } from 'rimraf';

import url from 'url';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const PORT = 5001;

let tmp: string;
let context: BuildContext;
let terminator: HttpTerminator;
let client: string;
const clientReplace = (string) => client.replace('<div id="text">0</div>', `<div id="text">${string}</div>`);
test.beforeEach(async () => {
  tmp = path.join(process.cwd(), '.tmp');
  await fs.copy(path.join(__dirname, '..', 'data'), tmp);
  client = await fs.readFile(path.join(tmp, 'client.tsx'), 'utf8');
  context = await esbuild.context({
    absWorkingDir: tmp,
    entryPoints: ['client.tsx'],
    bundle: true,
    outfile: 'public/js/bundle.js',
    plugins: [
      devServer({
        public: path.join(tmp, 'public'),
        port: PORT,
        beforeListen: (server) => {
          terminator = createHttpTerminator({ server });
        },
      }),
    ],
  });
  await context.watch();
});
test.afterEach(async () => {
  await terminator.terminate();
  await context.dispose();
  await rimraf(tmp);
});

test('plugin', async ({ page }) => {
  await page.goto(`http://127.0.0.1:${PORT}`);

  // start at 0
  await page.waitForSelector('div#root');
  let html = await page.$eval('div#text', (e) => e.innerHTML);
  assert.equal(html, '0');

  // replace with 1
  fs.writeFile(path.join(tmp, 'client.tsx'), clientReplace('1'), 'utf8');
  await page.waitForNavigation();
  await page.waitForSelector('div#root');
  html = await page.$eval('div#text', (e) => e.innerHTML);
  assert.equal(html, '1', 'page reloaded');

  // replace with error
  try {
    await page.$eval('iframe', (e) => e);
    assert.ok(false, 'frame found'); // not executed
  } catch (err) {
    assert.ok(err, 'frame not found');
  }
  fs.writeFile(path.join(tmp, 'client.tsx'), clientReplace('{'), 'utf8');
  await page.waitForSelector('iframe'); // frame found
  html = await page.$eval('div#text', (e) => e.innerHTML);
  assert.equal(html, '1', 'page not reloaded');
});
