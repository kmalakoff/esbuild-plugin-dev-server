import launchEditor from 'launch-editor';

// Opens the file named by the error overlay's "open in editor" request. REACT_EDITOR selects the editor; REACT_EDITOR=none turns it off.
export default function editorMiddleware(req, res, next) {
  if (!req.url.startsWith('/__open-stack-frame-in-editor')) return next();

  const query = new URL(req.url, 'http://localhost').searchParams;
  const fileName = query.get('fileName');
  const lineNumber = parseInt(query.get('lineNumber'), 10) || 1;
  const column = parseInt(query.get('colNumber'), 10);
  const colNumber = column > 0 ? column : 1;
  const off = (process.env.REACT_EDITOR ?? '').toLowerCase() === 'none';
  if (fileName && !off) launchEditor(`${fileName}:${lineNumber}:${colNumber}`, process.env.REACT_EDITOR);
  res.end();
}
