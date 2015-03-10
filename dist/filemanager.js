"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var Parser = _interopRequire(require("./parser"));

var FileManager = (function () {
  function FileManager(path) {
    _classCallCheck(this, FileManager);

    this.files = [];

    this.processFiles(this.getFiles(path));
  }

  _prototypeProperties(FileManager, null, {
    getFiles: {
      value: function getFiles(path) {
        var files = [];
        var pathStat = fs.statSync(path);

        if (pathStat.isFile()) {
          files.push(path);
        } else if (pathStat.isDirectory()) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = fs.readdirSync(path)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var file = _step.value;

              if (fs.statSync(path + "/" + file).isFile() && file.match(/\.js$/) !== null) {
                files.push(path + "/" + file);
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
        } else {
          throw new Error("Invalid path supplied to " + this.constructor.name);
        }

        return files;
      },
      writable: true,
      configurable: true
    },
    processFiles: {
      value: function processFiles(files) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var file = _step.value;

            this.files.push(new Parser(file));
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
      },
      writable: true,
      configurable: true
    }
  });

  return FileManager;
})();

module.exports = FileManager;