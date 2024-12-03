"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return client;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _launchEditorEndpoint = /*#__PURE__*/ _interop_require_default(require("react-dev-utils/launchEditorEndpoint"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var string = null;
function client() {
    if (string) return string;
    string = _fs.default.readFileSync(_path.default.join(__dirname, '..', '..', '..', 'assets', 'client.js'), 'utf8');
    string = string.replace("require('react-dev-utils/launchEditorEndpoint')", "'".concat(_launchEditorEndpoint.default, "'"));
    return string;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }