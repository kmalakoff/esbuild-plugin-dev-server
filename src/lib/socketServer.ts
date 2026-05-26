import type { Server } from 'http';
import SockJS from 'sockjs';

interface Connection {
  write(data: string): void;
  on(event: 'close', callback: () => void): void;
}

export default function socketServer(server: Server) {
  const connections: Connection[] = [];
  const sockjs = SockJS.createServer({
    prefix: '/esbuild',
    log: () => {
      /* silent */
    },
  });
  sockjs.installHandlers(server);
  sockjs.on('connection', (connection) => {
    const conn = connection as Connection;
    connections.push(conn);
    conn.on('close', () => connections.splice(connections.indexOf(conn), 1));
  });

  return function write(result: unknown): void {
    connections.forEach((res) => {
      res.write(JSON.stringify(result));
    });
  };
}
