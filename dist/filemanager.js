"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var JavascriptParser = _interopRequire(require("./javascriptparser"));

var FileManager = (function () {
  function FileManager() {
    _classCallCheck(this, FileManager);
  }

  _prototypeProperties(FileManager, {
    getFiles: {
      value: function getFiles(path) {
        var files = new Map();
        var pathStat = fs.statSync(path);

        if (pathStat.isFile()) {
          files.set(path, new JavascriptParser(fs.readFileSync(path, { encoding: "utf8" })));
        } else if (pathStat.isDirectory()) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = fs.readdirSync(path)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var file = _step.value;

              if (fs.statSync(path + "/" + file).isFile() && file.match(/\.js$/) !== null) {
                files.set(path + "/" + file, new JavascriptParser(fs.readFileSync(path + "/" + file, { encoding: "utf8" })));
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
          throw new Error("Invalid input path supplied to " + this.constructor.name);
        }

        return files;
      },
      writable: true,
      configurable: true
    },
    writeFiles: {
      value: function writeFiles(files, output) {
        if (fs.existsSync(output) && fs.statSync(output).isDirectory()) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _slicedToArray(_step.value, 2);

              var path = _step$value[0];
              var file = _step$value[1];

              fs.writeFileSync(output + "/" + path, file, { encoding: "utf8" });
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
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _slicedToArray(_step2.value, 2);

              var path = _step2$value[0];
              var file = _step2$value[1];

              fs.writeFileSync(output, file, { encoding: "utf8" });
              if (_iterator2["return"]) _iterator2["return"]();
              break;
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
      },
      writable: true,
      configurable: true
    }
  });

  return FileManager;
})();

module.exports = FileManager;