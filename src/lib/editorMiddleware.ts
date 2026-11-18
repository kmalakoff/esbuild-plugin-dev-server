import type { IncomingMessage, ServerResponse } from 'http';
import launchEditor from 'launch-editor';
import { EDITOR_ENDPOINT } from '../constants.ts';

// Opens the file named by the overlay's "open in editor" request; REACT_EDITOR still selects the editor.
export default function editorMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  const url = req.url ?? '';
  if (!url.startsWith(EDITOR_ENDPOINT)) return next();

  const query = new URL(url, 'http://localhost').searchParams;
  const fileName = query.get('fileName');
  const lineNumber = parseInt(query.get('lineNumber') ?? '', 10) || 1;
  const column = parseInt(query.get('colNumber') ?? '', 10);
  const colNumber = column > 0 ? column : 1;
  // REACT_EDITOR=none turns the button off
  const off = (process.env.REACT_EDITOR ?? '').toLowerCase() === 'none';
  if (fileName && !off) launchEditor(`${fileName}:${lineNumber}:${colNumber}`, process.env.REACT_EDITOR);
  res.end();
}
