import { createServer } from 'http';
import qs from 'querystring';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import staticHandler from 'serve-handler';
import client from './client.mjs';
import socketServer from './socketServer.mjs';

export default (options = {}) => {
  const port = options.port || process.env.PORT || 3000;
  const publicFolder = options.public || './public';
  const overlayHandler = errorOverlayMiddleware();

  return {
    name: 'dev-server',
    async setup(build) {
      // augment build options
      build.initialOptions.banner = build.initialOptions.banner || {};
      build.initialOptions.banner.js = `${build.initialOptions.banner.js || ''};${client()}`;

      const server = createServer((req, res) => {
        const parts = req.url.split('?');
        req.query = parts.length > 1 ? qs.parse(parts[1]) : {};
        overlayHandler(req, res, () => {
          staticHandler(req, res, {
            public: publicFolder,
            rewrites: [{ source: '**', destination: '/index.html' }],
          });
        });
      });

      build.onEnd(socketServer(server));
      if (options.beforeListen) options.beforeListen(server);
      await server.listen(port);
      if (options.afterListen) options.afterListen(server);
    },
  };
};
