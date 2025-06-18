import esbuild from 'esbuild';
import open from 'open';
import devServer from '../../lib/index.js'; // esbuild-plugin-dev-server

(async () => {
  await esbuild.build({
    entryPoints: ['client.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    plugins: [devServer({ public: 'public', port: 8000 })],
  });

  open('http://localhost:8000');
})();
