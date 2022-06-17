import esbuild from 'esbuild';
import devServer from '../../index.js';
import open from 'open';

(async () => {
  await esbuild.build({
    entryPoints: ['client.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    plugins: [devServer({ public: 'public', port: 8000 })],
  });

  open('http://localhost:8000');
})();
