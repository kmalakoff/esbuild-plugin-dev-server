// @ts-check
const { test } = require("@playwright/test");

const assert = require("node:assert");
const esbuild = require("esbuild");

// @ts-ignore
const devServer = require("esbuild-plugin-dev-server");
const { createHttpTerminator } = require("http-terminator");

const path = require("node:path");
const fs = require("fs-extra");
const { rimraf } = require("rimraf");

const PORT = 5001;

let tmp;
let context;
let terminator;
let client;
const clientReplace = (string) =>
	client.replace('<div id="text">0</div>', `<div id="text">${string}</div>`);
test.beforeEach(async () => {
	tmp = path.join(process.cwd(), ".tmp");
	await fs.copy(path.join(__dirname, "..", "data"), tmp);
	client = await fs.readFile(path.join(tmp, "client.tsx"), "utf8");
	context = await esbuild.context({
		absWorkingDir: tmp,
		entryPoints: ["client.tsx"],
		bundle: true,
		outfile: "public/js/bundle.js",
		plugins: [
			devServer({
				public: path.join(tmp, "public"),
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

test("plugin", async ({ page }) => {
	await page.goto(`http://127.0.0.1:${PORT}`);

	// start at 0
	await page.waitForSelector("div#root");
	let html = await page.$eval("div#text", (e) => e.innerHTML);
	assert.equal(html, "0");

	// replace with 1
	fs.writeFile(path.join(tmp, "client.tsx"), clientReplace("1"), "utf8");
	await page.waitForNavigation();
	await page.waitForSelector("div#root");
	html = await page.$eval("div#text", (e) => e.innerHTML);
	assert.equal(html, "1", "page reloaded");

	// replace with error
	try {
		await page.$eval("iframe", (e) => e);
		assert.ok(false, "frame found"); // not executed
	} catch (err) {
		assert.ok(err, "frame not found");
	}
	fs.writeFile(path.join(tmp, "client.tsx"), clientReplace("{"), "utf8");
	await page.waitForSelector("iframe"); // frame found
	html = await page.$eval("div#text", (e) => e.innerHTML);
	assert.equal(html, "1", "page not reloaded");
});
