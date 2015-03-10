"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var minimist = _interopRequire(require("minimist"));

var polyfill = _interopRequire(require("babel/polyfill"));

var FileManager = _interopRequire(require("./filemanager"));

var JsonTransformer = _interopRequire(require("./jsontransformer"));

var MarkdownTransformer = _interopRequire(require("./markdowntransformer"));

var HtmlTransformer = _interopRequire(require("./htmltransformer"));

var args = minimist(process.argv.slice(2));

var fileManager = new FileManager(args._[0]);

switch (args.f) {
  case "json":
    //let json = new JsonTransformer(code, args.o);
    break;
  case "markdown":
    //let md = new MarkdownTransformer(code, args.o);
    break;
  case "html":
    var html = new HtmlTransformer(fileManager.files, args.o, args.t);
    break;
}