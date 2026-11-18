const assert = require('assert');
const { default: plugin, client, socketServer } = require('esbuild-plugin-dev-server');

describe('exports .cjs', () => {
  it('default', () => {
    assert.equal(typeof plugin, 'function');
  });
  it('client', () => {
    assert.equal(typeof client, 'function');
  });
  it('socketServer', () => {
    assert.equal(typeof socketServer, 'function');
  });
});
