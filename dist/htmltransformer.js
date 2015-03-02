"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var jade = _interopRequire(require("jade"));

var HtmlTransformer = function HtmlTransformer(data, htmlFile, jadeFile) {
  _classCallCheck(this, HtmlTransformer);

  var template = jade.compileFile(jadeFile);

  fs.writeFileSync(htmlFile, template({ data: data[0][0] }));

  //console.log(template({data: data[0][0]}));
};

module.exports = HtmlTransformer;