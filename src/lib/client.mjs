import fs from 'fs';
import path from 'path';
import endpoint from 'react-dev-utils/launchEditorEndpoint';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

let string = null;
export default function client() {
  if (string) return string;
  string = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'assets', 'client.js'), 'utf8');
  string = string.replace(`require('react-dev-utils/launchEditorEndpoint')`, `'${endpoint}'`);
  return string;
}
