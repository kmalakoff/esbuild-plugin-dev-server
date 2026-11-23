import esbuild from 'esbuild';
import open from 'open';
import devServer from '../../dist/esm/index.js'; // esbuild-plugin-dev-server (built output)

(async () => {
  await esbuild.build({
    entryPoints: ['client.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    plugins: [devServer({ public: 'public', port: 8000 })],
  });

  open('http://localhost:8000');
})();
