import type { Server } from 'http';
import SockJS from 'sockjs';

export default function socketServer(server: Server) {
  const connections = [];
  const sockjs = SockJS.createServer({
    prefix: '/esbuild',
    log: () => {
      /* silent */
    },
  });
  sockjs.installHandlers(server);
  sockjs.on('connection', (connection) => {
    connections.push(connection);
    connection.on('close', () => connections.splice(connections.indexOf(connection), 1));
  });

  return function write(result: unknown): undefined {
    connections.forEach((res) => {
      res.write(JSON.stringify(result));
    });
  };
}
