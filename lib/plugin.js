const { createServer } = require('http');
const qs = require('querystring');
const staticHandler = require('serve-handler');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const client = require('./client');
const socketServer = require('./socketServer');

module.exports = (options = {}) => {
  const port = options.port || process.env.PORT || 3000;
  const public = options.public || './public';
  const overlayHandler = errorOverlayMiddleware();
  const isOveridable = (option) => option === undefined || !!option;

  return {
    name: 'dev-server',
    setup(build) {
      // augment build options
      build.initialOptions.banner = build.initialOptions.banner || {};
      build.initialOptions.banner.js = `${build.initialOptions.banner.js || ''};${client}`;
      if (!isOveridable(build.initialOptions.incremental)) console.warn('esbuild incremental ovreridding to true for esbuild-plugin-dev-server serve');
      build.initialOptions.incremental = true;
      if (!isOveridable(build.initialOptions.watch)) console.warn('esbuild incremental ovreridding to true for esbuild-plugin-dev-server serve');
      build.initialOptions.watch = true;

      const server = createServer((req, res) => {
        const parts = req.url.split('?');
        req.query = parts.length > 1 ? qs.parse(parts[1]) : {};
        overlayHandler(req, res, () => {
          staticHandler(req, res, {
            public,
            rewrites: [{ source: '**', destination: '/index.html' }],
          });
        });
      });
      build.onEnd(socketServer(server));
      server.listen(port);
    },
  };
};
