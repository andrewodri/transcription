"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var util = _interopRequire(require("util"));

var acorn = _interopRequire(require("acorn"));

var doctrine = _interopRequire(require("doctrine"));

var markdown = _interopRequire(require("markdown"));

var JavascriptParser = (function () {
  function JavascriptParser(data) {
    _classCallCheck(this, JavascriptParser);

    var comments = [];

    this.ast = acorn.parse(data, {
      ecmaVersion: 6,
      onComment: function (block, text, start, end) {
        if (block) comments.push({ block: block, text: text, start: start, end: end });
      }
    });

    this.comments = comments[Symbol.iterator]();
    this.currentComment = this.comments.next();

    //console.log(util.inspect(this.ast.body, false, 5));

    //console.log(util.inspect(this.transform(this.ast.body), false, 10));

    //console.log(comments);

    var transformed = this.getJavascript(this.ast.body);

    this.imports = transformed.filter(function (element) {
      return element.type == "import";
    });
    this.classes = transformed.filter(function (element) {
      return element.type == "export";
    }).map(function (element) {
      return element.variables[0];
    });
  }

  _prototypeProperties(JavascriptParser, null, {
    getJavascript: {
      value: function getJavascript(parent) {
        var result = [];
        var position = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = parent[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            switch (node.type) {
              case "ImportDeclaration":
                result.push({
                  type: "import",
                  name: node.specifiers[0].id.name,
                  path: node.source.value
                });
                if (_iterator["return"]) _iterator["return"]();
                break;
              case "ExportDeclaration":
                Object.defineProperty(node.declaration, "export", { value: true });
                Object.defineProperty(node.declaration, "default", { value: node["default"] });

                result.push({
                  type: "export",
                  variables: this.getJavascript([node.declaration])
                });
                if (_iterator["return"]) _iterator["return"]();
                break;
              case "ClassDeclaration":
                result.push({
                  type: "class",
                  name: node.id.name,
                  "extends": node.superClass !== null ? node.superClass.name : null,
                  comments: this.getComments(position, node.start),
                  methods: this.getJavascript(node.body.body),
                  isPublic: node.hasOwnProperty("export") && node["export"],
                  isDefault: node.hasOwnProperty("default") && node["default"]
                });
                if (_iterator["return"]) _iterator["return"]();
                break;
              case "MethodDefinition":
                result.push({
                  type: "function",
                  name: node.key.name,
                  params: Array.from(node.value.params, function (x) {
                    return x.name;
                  }),
                  comments: this.getComments(position, node.start),
                  isConstructor: !node["static"] && node.key.name == "constructor",
                  isStatic: node["static"],
                  isGetter: node.hasOwnProperty("kind") && node.kind == "get",
                  isSetter: node.hasOwnProperty("kind") && node.kind == "set",
                  isGenerator: node.value.generator
                });
                if (_iterator["return"]) _iterator["return"]();
                break;
            }

            position = node.end;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return result;
      },
      writable: true,
      configurable: true
    },
    getComments: {
      value: function getComments(prevEnd, nextStart) {
        if (!this.currentComment.done && prevEnd <= this.currentComment.value.start && nextStart > this.currentComment.value.end) {
          var comments = doctrine.parse(this.currentComment.value.text, {
            unwrap: true,
            recoverable: true
          });

          comments.parsed = markdown.markdown.toHTML(comments.description);

          this.currentComment = this.comments.next();

          return comments;
        } else {
          return null;
        }
      },
      writable: true,
      configurable: true
    }
  });

  return JavascriptParser;
})();

module.exports = JavascriptParser;