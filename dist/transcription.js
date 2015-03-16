"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var polyfill = _interopRequire(require("babel/polyfill"));

var FileManager = _interopRequire(require("./filemanager"));

var JavascriptParser = _interopRequire(require("./javascriptparser"));

var JsonTransformer = _interopRequire(require("./jsontransformer"));

var MarkdownTransformer = _interopRequire(require("./markdowntransformer"));

var HtmlTransformer = _interopRequire(require("./htmltransformer"));

var Transcription = (function () {
  function Transcription() {
    _classCallCheck(this, Transcription);
  }

  _prototypeProperties(Transcription, {
    transformFiles: {
      value: function transformFiles(input, output) {
        var format = arguments[2] === undefined ? "html" : arguments[2];
        var template = arguments[3] === undefined ? "./jade" : arguments[3];

        var files = FileManager.getFiles(input);
        var transformedFiles = new Map();

        switch (format) {
          case "json":
            transformedFiles = JsonTransformer.transform(files);
            break;
          case "md":
            transformedFiles = MarkdownTransformer.transform(files);
            break;
          case "html":
            transformedFiles = HtmlTransformer.transform(files, template);
            break;
        }

        if (output !== undefined) {
          Transcription.writeFiles(transformedFiles, output);
        } else {
          Transcription.writeStdout(transformedFiles);
        }
      },
      writable: true,
      configurable: true
    },
    transformStdin: {
      value: function transformStdin(output) {
        var format = arguments[1] === undefined ? "html" : arguments[1];
        var template = arguments[2] === undefined ? "./jade" : arguments[2];

        var data = "";
        var stdin = new Map();

        process.stdin.on("readable", function () {
          data += process.stdin.read();
        });

        process.stdin.on("end", function () {
          var transformedFiles = new Map();
          stdin.set("stdin", new JavascriptParser(data));

          switch (format) {
            case "json":
              transformedFiles = JsonTransformer.transform(stdin);
              break;
            case "md":
              transformedFiles = MarkdownTransformer.transform(stdin);
              break;
            case "html":
              transformedFiles = HtmlTransformer.transform(stdin, template);
              break;
          }

          if (output !== undefined) {
            Transcription.writeFiles(transformedFiles, output);
          } else {
            Transcription.writeStdout(transformedFiles);
          }
        });
      },
      writable: true,
      configurable: true
    },
    writeFiles: {
      value: function writeFiles(transformedFiles, output) {
        FileManager.writeFiles(transformedFiles, output);
      },
      writable: true,
      configurable: true
    },
    writeStdout: {
      value: function writeStdout(transformedFiles) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = transformedFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var id = _step$value[0];
            var data = _step$value[1];

            process.stdout.write(data);
            if (_iterator["return"]) _iterator["return"]();
            break;
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

  return Transcription;
})();

module.exports = Transcription;