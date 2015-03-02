"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var util = _interopRequire(require("util"));

var MarkdownTransformer = (function () {
  function MarkdownTransformer(data, mdFile) {
    _classCallCheck(this, MarkdownTransformer);

    var md = this.markdown(data[0][0]);

    fs.writeFileSync(mdFile, md);

    //console.log(template({data: data[0][0]}));
  }

  _prototypeProperties(MarkdownTransformer, null, {
    markdown: {
      value: function markdown(data) {
        var result = "";

        var classHeading = "# %s\n\n";
        var methodHeading = "## %s\n\n";
        var paragraph = "%s\n\n";
        var tableWrapper = "<table>%s</table>\n\n";
        var parameter = "<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>";

        result += util.format(classHeading, data.name);
        result += util.format(paragraph, data.comments.description);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var method = _step.value;

            result += util.format(methodHeading, method.name);
            result += util.format(paragraph, method.comments.description);

            var table = "";
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = method.comments.tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var tag = _step2.value;

                table += util.format(parameter, tag.title, tag.name, tag.type ? tag.type.name : "", tag.description);
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

            result += util.format(tableWrapper, table);
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
    }
  });

  return MarkdownTransformer;
})();

module.exports = MarkdownTransformer;