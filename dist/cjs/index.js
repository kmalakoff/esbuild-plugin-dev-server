"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    client: function() {
        return _client.default;
    },
    default: function() {
        return _default;
    },
    socketServer: function() {
        return _socketServer.default;
    }
});
var _plugin = /*#__PURE__*/ _interop_require_default(require("./lib/plugin.js"));
var _socketServer = /*#__PURE__*/ _interop_require_default(require("./lib/socketServer.js"));
var _client = /*#__PURE__*/ _interop_require_default(require("./lib/client.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _default = _plugin.default;
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }