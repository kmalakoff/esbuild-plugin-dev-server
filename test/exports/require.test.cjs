const { test } = require('@playwright/test');

const assert = require('assert');
const { default: plugin, client, socketServer } = require('esbuild-plugin-dev-server');

test.describe('exports .cjs', () => {
  test('default', () => {
    assert.equal(typeof plugin, 'function');
  });
  test('client', () => {
    assert.equal(typeof client, 'function');
  });
  test('socketServer', () => {
    assert.equal(typeof socketServer, 'function');
  });
});
