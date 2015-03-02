"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var minimist = _interopRequire(require("minimist"));

var polyfill = _interopRequire(require("babel/polyfill"));

var Parser = _interopRequire(require("./parser"));

var JsonTransformer = _interopRequire(require("./jsontransformer"));

var MarkdownTransformer = _interopRequire(require("./markdowntransformer"));

var HtmlTransformer = _interopRequire(require("./htmltransformer"));

var args = minimist(process.argv.slice(2));

var code = new Parser(args._[0]);

switch (args.f) {
  case "json":
    var json = new JsonTransformer(code, args.o);
    break;
  case "markdown":
    var md = new MarkdownTransformer(code, args.o);
    break;
  case "html":
    var html = new HtmlTransformer(code, args.o, args.t);
    break;
}