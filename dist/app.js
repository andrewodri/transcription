"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var polyfill = _interopRequire(require("babel/polyfill"));

var Parser = _interopRequire(require("./parser"));

var Transformer = _interopRequire(require("./transformer"));

var code = new Parser("./controller.js");
var html = new Transformer(code);