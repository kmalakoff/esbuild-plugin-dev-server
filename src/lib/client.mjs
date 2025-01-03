import fs from 'fs';
import path from 'path';
import endpoint from 'react-dev-utils/launchEditorEndpoint';

let string = null;
export default function client() {
  if (string) return string;
  string = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'assets', 'client.cjs'), 'utf8');
  string = string.replace(`require('react-dev-utils/launchEditorEndpoint')`, `'${endpoint}'`);
  return string;
}
