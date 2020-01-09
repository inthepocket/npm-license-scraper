"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDependencies = getDependencies;
exports.getPackageDescriptor = getPackageDescriptor;
exports.getPackageInfo = getPackageInfo;

var _path = _interopRequireDefault(require("path"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasProp(o, prop) {
  return Object.prototype.hasOwnProperty.call(o, prop);
}
/**
 * Returns the dependencies for the project's package.json.
 * By default returns both dependencies and dev dependencies as a tuple.
 * If false is passed, will return a tuple with only the dependencies
 */


async function getDependencies(includeDev = true) {
  try {
    const pkg = await (0, _util.readJSONFile)(_path.default.join(process.cwd(), 'package.json'));

    if (!hasProp(pkg, 'dependencies')) {
      if (!includeDev || !hasProp(pkg, 'devDependencies')) {
        console.error('Your project does not contain any dependencies');
        process.exit(1);
      }

      return [[], Object.keys(pkg.devDependencies)];
    }

    return includeDev ? [Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)] : [Object.keys(pkg.dependencies), null];
  } catch (error) {
    console.log('Could not get dependencies from package.json:', error);
    return process.exit(1);
  }
}
/**
 * Returns descriptor (basepath and package.json content) for a package
 */


async function getPackageDescriptor(dep) {
  const basePath = _path.default.join(process.cwd(), 'node_modules', dep);

  const pkg = await (0, _util.readJSONFile)(_path.default.join(basePath, 'package.json'));
  return {
    basePath,
    pkg
  };
}
/**
 * Returns metadata for package.json content
 */


function getPackageInfo(pkg) {
  return {
    version: pkg.version,
    license: pkg.license,
    url: pkg.homepage || pkg.repository && pkg.repository.url
  };
}