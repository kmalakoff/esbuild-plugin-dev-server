declare module 'react-dev-utils/errorOverlayMiddleware.js' {
  import type { IncomingMessage, ServerResponse } from 'http';
  type NextFunction = (err?: Error) => void;
  type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => void;
  function errorOverlayMiddleware(): Middleware;
  export = errorOverlayMiddleware;
}
