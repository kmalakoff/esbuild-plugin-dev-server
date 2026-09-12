import { test } from '@playwright/test';

import assert from 'assert';
import plugin, { client, socketServer } from 'esbuild-plugin-dev-server';

test.describe('exports .ts', () => {
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
