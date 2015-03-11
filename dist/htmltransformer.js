"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var jade = _interopRequire(require("jade"));

var HtmlTransformer = (function () {
  function HtmlTransformer(files, outputDir, templateDir) {
    _classCallCheck(this, HtmlTransformer);

    this.outputDir = outputDir;
    this.templateDir = templateDir;

    this.buildIndex(files);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var file = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = file.classes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var classObject = _step2.value;

            this.buildClass(classObject);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
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
  }

  _prototypeProperties(HtmlTransformer, null, {
    buildIndex: {
      value: function buildIndex(files) {
        var template = jade.compileFile(this.templateDir + "/index.jade");

        fs.writeFileSync(this.outputDir + "/index.html", template({ files: files }));
      },
      writable: true,
      configurable: true
    },
    buildClass: {
      value: function buildClass(classObject) {
        var template = jade.compileFile(this.templateDir + "/class.jade");

        fs.writeFileSync(this.outputDir + "/" + classObject.name + ".html", template({ data: classObject }));
      },
      writable: true,
      configurable: true
    }
  });

  return HtmlTransformer;
})();

module.exports = HtmlTransformer;