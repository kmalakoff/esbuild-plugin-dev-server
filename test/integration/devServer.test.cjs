// Real plugin, real esbuild build, real HTTP requests. Runs on every supported Node version.
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const esbuild = require('esbuild');
const { createHttpTerminator } = require('http-terminator');
const { safeRmSync } = require('fs-remove-compat');
const { default: plugin, client } = require('esbuild-plugin-dev-server');

const ENDPOINT = '/__open-stack-frame-in-editor';
const PORT = 5002;
const ROOT = path.join(__dirname, '..', '..', '.tmp', `dev-server-${process.pid}`);
const STUB = path.join(__dirname, '..', 'lib', 'editor-stub.cjs');

function waitFor(what, check) {
  const deadline = Date.now() + 15000;
  return new Promise((resolve, reject) => {
    (function poll() {
      Promise.resolve(check()).then((value) => {
        if (value) return resolve(value);
        if (Date.now() > deadline) return reject(new Error(`timed out waiting for ${what}`));
        setTimeout(poll, 25);
      }, reject);
    })();
  });
}

function request(method, urlPath, onResponse) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path: urlPath, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (onResponse) onResponse(req);
    req.end();
  });
}

describe('dev server', () => {
  let context;
  let terminator;
  let listening;
  const saved = {};

  beforeEach(async () => {
    fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'public', 'index.html'), '<div id="root">index</div>');
    fs.writeFileSync(path.join(ROOT, 'public', 'file.txt'), 'static file');
    fs.writeFileSync(path.join(ROOT, 'entry.js'), 'console.log("ok");');
    for (const key of ['REACT_EDITOR', 'LAUNCH_EDITOR', 'EDITOR_STUB_MARKER']) saved[key] = process.env[key];
    context = await esbuild.context({
      absWorkingDir: ROOT,
      entryPoints: ['entry.js'],
      bundle: true,
      outfile: 'public/bundle.js',
      logLevel: 'silent',
      plugins: [
        plugin({
          public: path.join(ROOT, 'public'),
          port: PORT,
          beforeListen: (server) => {
            terminator = createHttpTerminator({ server });
            listening = new Promise((resolve) => server.once('listening', resolve));
          },
        }),
      ],
    });
    await listening;
  });

  afterEach(async () => {
    for (const key of Object.keys(saved)) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    await terminator.terminate();
    await context.dispose();
    safeRmSync(ROOT, { recursive: true, force: true });
  });

  it('serves static files and rewrites other paths to index.html', async () => {
    assert.deepEqual(await request('GET', '/file.txt'), { status: 200, body: 'static file' });
    assert.deepEqual(await request('GET', '/anything/else'), { status: 200, body: '<div id="root">index</div>' });
  });

  it('injects the client with the editor endpoint into the bundle', async () => {
    await context.rebuild();
    const bundle = fs.readFileSync(path.join(ROOT, 'public', 'bundle.js'), 'utf8');
    assert.ok(bundle.includes(`'${ENDPOINT}'`) || bundle.includes(`"${ENDPOINT}"`));
    assert.ok(client().includes(`'${ENDPOINT}'`));
    assert.ok(!client().includes('__EDITOR_ENDPOINT__'));
  });

  describe('build results over sockjs', () => {
    // sockjs xhr polling: the first poll opens the session ("o"), later polls carry "a[...]" frames.
    async function openSession() {
      const session = `s${Date.now()}`;
      const open = await request('POST', `/esbuild/000/${session}/xhr`);
      assert.equal(open.body, 'o\n');
      return session;
    }

    it('pushes a successful build', async () => {
      const session = await openSession();
      const poll = request('POST', `/esbuild/000/${session}/xhr`);
      await context.rebuild();
      const frame = (await poll).body;
      assert.ok(frame.startsWith('a['));
      assert.deepEqual(JSON.parse(JSON.parse(frame.slice(1))[0]).errors, []);
    });

    it('pushes a failed build with its errors', async () => {
      const session = await openSession();
      const poll = request('POST', `/esbuild/000/${session}/xhr`);
      fs.writeFileSync(path.join(ROOT, 'entry.js'), 'const = ;');
      await context.rebuild().then(
        () => assert.fail('expected build failure'),
        () => {}
      );
      const result = JSON.parse(JSON.parse((await poll).body.slice(1))[0]);
      assert.equal(result.errors.length, 1);
    });
  });

  describe('open in editor', () => {
    it('launches the configured editor with the requested file', async () => {
      const marker = path.join(ROOT, 'launched.json');
      process.env.EDITOR_STUB_MARKER = marker;
      process.env.REACT_EDITOR = 'node';
      const res = await request('GET', `${ENDPOINT}?fileName=${encodeURIComponent(STUB)}&lineNumber=3&colNumber=2`);
      assert.equal(res.status, 200);
      await waitFor('editor stub to run', () => fs.existsSync(marker));
    });

    it('passes the line and column to the editor', async () => {
      const marker = path.join(ROOT, 'launched.json');
      process.env.EDITOR_STUB_MARKER = marker;
      process.env.LAUNCH_EDITOR = 'node';
      const res = await request('GET', `${ENDPOINT}?fileName=${encodeURIComponent(STUB)}&lineNumber=3&colNumber=2`);
      assert.equal(res.status, 200);
      await waitFor('editor stub to run', () => fs.existsSync(marker));
      assert.deepEqual(JSON.parse(fs.readFileSync(marker, 'utf8')), ['3', '2']);
    });

    it('defaults the line and column to 1 when they are missing', async () => {
      const marker = path.join(ROOT, 'launched-defaults.json');
      process.env.EDITOR_STUB_MARKER = marker;
      delete process.env.REACT_EDITOR;
      process.env.LAUNCH_EDITOR = 'node';
      const res = await request('GET', `${ENDPOINT}?fileName=${encodeURIComponent(STUB)}`);
      assert.equal(res.status, 200);
      await waitFor('editor stub to run', () => fs.existsSync(marker));
      assert.deepEqual(JSON.parse(fs.readFileSync(marker, 'utf8')), ['1', '1']);
    });

    it('opens the file at column 1 when the column is not positive', async () => {
      const marker = path.join(ROOT, 'launched-column.json');
      process.env.EDITOR_STUB_MARKER = marker;
      delete process.env.REACT_EDITOR;
      process.env.LAUNCH_EDITOR = 'node';
      const res = await request('GET', `${ENDPOINT}?fileName=${encodeURIComponent(STUB)}&lineNumber=3&colNumber=-7`);
      assert.equal(res.status, 200);
      await waitFor('editor stub to run', () => fs.existsSync(marker));
      assert.deepEqual(JSON.parse(fs.readFileSync(marker, 'utf8')), ['3', '1']);
    });

    it('launches nothing when REACT_EDITOR is none, even if a program has that name', async () => {
      // a real program called "none" on the PATH: it runs only if the off switch is ignored
      const bin = path.join(ROOT, 'bin');
      const marker = path.join(ROOT, 'launched-none.json');
      fs.mkdirSync(bin, { recursive: true });
      fs.writeFileSync(path.join(bin, 'none'), `#!/bin/sh\nexec "${process.execPath}" "${STUB}" "$@"\n`, { mode: 0o755 });
      fs.writeFileSync(path.join(bin, 'none.cmd'), `@"${process.execPath}" "${STUB}" %*\r\n`);
      const PATH_KEY = Object.keys(process.env).find((key) => key.toLowerCase() === 'path') || 'PATH';
      const before = process.env[PATH_KEY];
      process.env[PATH_KEY] = bin + path.delimiter + before;
      process.env.EDITOR_STUB_MARKER = marker;
      process.env.REACT_EDITOR = 'none';
      try {
        const res = await request('GET', `${ENDPOINT}?fileName=${encodeURIComponent(STUB)}&lineNumber=3&colNumber=2`);
        assert.equal(res.status, 200);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        assert.ok(!fs.existsSync(marker));
      } finally {
        process.env[PATH_KEY] = before;
      }
    });

    it('answers without launching when fileName is missing', async () => {
      const marker = path.join(ROOT, 'launched.json');
      process.env.EDITOR_STUB_MARKER = marker;
      process.env.REACT_EDITOR = 'node';
      const res = await request('GET', `${ENDPOINT}?lineNumber=3`);
      assert.equal(res.status, 200);
      assert.ok(!fs.existsSync(marker));
    });

    it('does not launch for a missing file', async () => {
      const marker = path.join(ROOT, 'launched.json');
      process.env.EDITOR_STUB_MARKER = marker;
      process.env.REACT_EDITOR = 'node';
      const res = await request('GET', `${ENDPOINT}?fileName=${encodeURIComponent(path.join(ROOT, 'missing.js'))}&lineNumber=1`);
      assert.equal(res.status, 200);
      assert.ok(!fs.existsSync(marker));
    });
  });
});
