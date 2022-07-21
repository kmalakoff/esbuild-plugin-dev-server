const { chromium } = require('playwright');
const assert = require('assert');

const esbuild = require('esbuild');
const devServer = require('../..');
const { createHttpTerminator } = require('http-terminator');

const path = require('path');
const fs = require('fs-extra');

const PORT = 5000;

describe('plugin', () => {
  let browser;
  before(async () => {
    browser = await chromium.launch();
  });
  after(async () => {
    await browser.close();
  });

  let tmp;
  let build;
  let terminator;
  let client;
  const clientReplace = (string) => client.replace('<div id="text">0</div>', `<div id="text">${string}</div>`);
  beforeEach(async () => {
    tmp = path.join(process.cwd(), '.tmp');
    await fs.copy(path.join(__dirname, '..', 'data'), tmp);
    client = await fs.readFile(path.join(tmp, 'client.tsx'), 'utf8');
    build = await esbuild.build({
      absWorkingDir: tmp,
      entryPoints: ['client.tsx'],
      bundle: true,
      outfile: 'public/js/bundle.js',
      plugins: [devServer({ public: path.join(tmp, 'public'), port: PORT, beforeListen: (server) => (terminator = createHttpTerminator({ server })) })],
    });
  });
  afterEach(async () => {
    await terminator.terminate();
    await build.stop();
    fs.remove(tmp);
  });

  it('should reload the page on content change', async () => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}`);

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
});
