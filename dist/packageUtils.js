"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDependencies = getDependencies;
exports.getPackageDescriptor = getPackageDescriptor;
exports.getPackageInfo = getPackageInfo;
var _path = _interopRequireDefault(require("path"));
var _util = require("./util");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function hasProp(o, prop) {
  return Object.prototype.hasOwnProperty.call(o, prop);
}

/**
 * Returns the dependencies for the project's package.json.
 * By default returns both dependencies and dev dependencies as a tuple.
 * If false is passed, will return a tuple with only the dependencies
 */
async function getDependencies(includeDev) {
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
 * Returns descriptor (basePath and package.json content) for a package
 * Emulating node js module resolution (see: https://medium.com/outbrain-engineering/node-js-module-resolution-af46715784ef)
 */
async function getPackageDescriptor(dep, basePath = process.cwd(), basePathTries = []) {
  try {
    const pkg = await (0, _util.readJSONFile)(_path.default.join(basePath, 'node_modules', dep, 'package.json'), false);
    return {
      pkg,
      basePath: _path.default.join(basePath, 'node_modules', dep)
    };
  } catch (error) {
    basePathTries = [...basePathTries, _path.default.join(basePath, 'node_modules', dep)];
    if (basePath === '/') {
      console.error(`Could not find package: '${dep}', tried: \n\t${basePathTries.join('\n\t')}`);
      return process.exit(1);
    }
    return getPackageDescriptor(dep, _path.default.join(basePath, '..'), basePathTries);
  }
}

/**
 * Returns metadata for package.json content
 */
function getPackageInfo(pkg) {
  const [url] = [pkg.homepage, pkg.repository?.url, pkg.repository?.baseUrl, pkg.repo].filter(Boolean).filter(url => url?.startsWith('https'));
  return {
    version: pkg.version,
    license: pkg.license,
    url: url ?? `https://npmjs.com/package/${pkg.name}`
  };
}