"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _http = require("http");
var _querystring = /*#__PURE__*/ _interop_require_default(require("querystring"));
var _errorOverlayMiddleware = /*#__PURE__*/ _interop_require_default(require("react-dev-utils/errorOverlayMiddleware"));
var _servehandler = /*#__PURE__*/ _interop_require_default(require("serve-handler"));
var _client = /*#__PURE__*/ _interop_require_default(require("./client.js"));
var _socketServer = /*#__PURE__*/ _interop_require_default(require("./socketServer.js"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var _default = function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var port = options.port || process.env.PORT || 3000;
    var publicFolder = options.public || './public';
    var overlayHandler = (0, _errorOverlayMiddleware.default)();
    return {
        name: 'dev-server',
        setup: function setup(build) {
            return _async_to_generator(function() {
                var server;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // augment build options
                            build.initialOptions.banner = build.initialOptions.banner || {};
                            build.initialOptions.banner.js = "".concat(build.initialOptions.banner.js || '', ";").concat((0, _client.default)());
                            server = (0, _http.createServer)(function(req, res) {
                                var parts = req.url.split('?');
                                req.query = parts.length > 1 ? _querystring.default.parse(parts[1]) : {};
                                overlayHandler(req, res, function() {
                                    (0, _servehandler.default)(req, res, {
                                        public: publicFolder,
                                        rewrites: [
                                            {
                                                source: '**',
                                                destination: '/index.html'
                                            }
                                        ]
                                    });
                                });
                            });
                            build.onEnd((0, _socketServer.default)(server));
                            if (options.beforeListen) options.beforeListen(server);
                            return [
                                4,
                                server.listen(port)
                            ];
                        case 1:
                            _state.sent();
                            if (options.afterListen) options.afterListen(server);
                            return [
                                2
                            ];
                    }
                });
            })();
        }
    };
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }