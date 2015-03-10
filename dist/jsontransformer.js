"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var JsonTransformer = function JsonTransformer(data, jsonFile) {
  _classCallCheck(this, JsonTransformer);

  fs.writeFileSync(jsonFile, JSON.stringify(data));
};

module.exports = JsonTransformer;