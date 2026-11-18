import fs from 'fs';
import path from 'path';
import url from 'url';
import { EDITOR_ENDPOINT } from '../constants.ts';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

let string: string | null = null;
export default function client(): string {
  if (string) return string;
  string = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'assets', 'client.cjs'), 'utf8');
  string = string.replace(`'__EDITOR_ENDPOINT__'`, `'${EDITOR_ENDPOINT}'`);
  return string;
}
