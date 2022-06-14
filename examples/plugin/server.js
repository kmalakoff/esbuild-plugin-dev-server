import esbuild from 'esbuild';
import devServer from '../../index.js';
import open from 'open';

esbuild.build({
  entryPoints: ['src/client.tsx'],
  bundle: true,
  outfile: 'public/bundle.js',
  plugins: [devServer({ public: 'public', port: 8000 })],
});

open('http://localhost:8000');
