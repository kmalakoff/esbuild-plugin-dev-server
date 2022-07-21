const SockJS = require('sockjs');

module.exports = function socketServer(server) {
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

  return function write(result) {
    connections.forEach((res) => res.write(JSON.stringify(result)));
  };
};
