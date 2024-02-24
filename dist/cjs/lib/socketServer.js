"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return socketServer;
    }
});
var _sockjs = /*#__PURE__*/ _interop_require_default(require("sockjs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function socketServer(server) {
    var connections = [];
    var sockjs = _sockjs.default.createServer({
        prefix: "/esbuild",
        log: function() {
        /* silent */ }
    });
    sockjs.installHandlers(server);
    sockjs.on("connection", function(connection) {
        connections.push(connection);
        connection.on("close", function() {
            return connections.splice(connections.indexOf(connection), 1);
        });
    });
    return function write(result) {
        connections.forEach(function(res) {
            return res.write(JSON.stringify(result));
        });
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }