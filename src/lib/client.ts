import fs from 'fs';
import path from 'path';
import url from 'url';
import endpoint from 'react-dev-utils/launchEditorEndpoint.js';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

let string = null;
export default function client(): string {
  if (string) return string;
  string = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'assets', 'client.cjs'), 'utf8');
  string = string.replace(`require('react-dev-utils/launchEditorEndpoint')`, `'${endpoint}'`);
  return string;
}
