import type { Plugin, PluginBuild } from 'esbuild';
import { createServer } from 'http';
import staticHandler from 'serve-handler';
import type { Options } from '../types.ts';
import client from './client.ts';
import editorMiddleware from './editorMiddleware.ts';
import socketServer from './socketServer.ts';

export default (options: Options = {}): Plugin => {
  const port = options.port || process.env.PORT || 3000;
  const publicFolder = options.public || './public';

  return {
    name: 'dev-server',
    async setup(build: PluginBuild): Promise<void> {
      // augment build options
      build.initialOptions.banner = build.initialOptions.banner || {};
      build.initialOptions.banner.js = `${build.initialOptions.banner.js || ''};${client()}`;

      const server = createServer((req, res) => {
        editorMiddleware(req, res, () => {
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
