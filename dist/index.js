#! /usr/bin/env node
"use strict";

var _promises = _interopRequireDefault(require("fs/promises"));
var _path = _interopRequireDefault(require("path"));
var _licenseUtils = require("./licenseUtils");
var _util = require("./util");
var _packageUtils = require("./packageUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function readFromLicenseFile(basePath) {
  const matches = await _promises.default.readdir(basePath);
  const validLicenseFiles = matches.filter(match => match.toUpperCase().startsWith('LICENSE'));
  if (validLicenseFiles.length < 1) {
    console.log(`No valid license files found in ${basePath}`);
    return null;
  }
  const licenseFile = _path.default.join(basePath, validLicenseFiles[0]);
  const contents = (await _promises.default.readFile(licenseFile)).toString();
  const file = licenseFile.split('node_modules/')[1];
  return {
    file,
    contents
  };
}
async function getPackageDetails(dep) {
  const {
    basePath,
    pkg
  } = await (0, _packageUtils.getPackageDescriptor)(dep);
  const info = (0, _packageUtils.getPackageInfo)(pkg);
  const inferFromLicenseFile = await readFromLicenseFile(basePath);

  // When no license field is present in package.json we try and infer it from a LICENSE file
  // if that file exists
  if (!info.license) {
    if (inferFromLicenseFile) {
      info.license = inferFromLicenseFile.contents;
    }
  }
  return {
    package: dep,
    ...info,
    license: (0, _licenseUtils.isValidLicense)(info.license) ? info.license : 'UNKNOWN',
    isValid: (0, _licenseUtils.isValidLicense)(info.license)
  };
}
(async () => {
  const flags = (0, _util.parseCLIFlags)(process.argv);
  let [dependencies, devDependencies] = await (0, _packageUtils.getDependencies)(Boolean(flags.includeDev));
  if (devDependencies !== null) {
    dependencies = [...dependencies, ...devDependencies];
  }
  if (flags.exclude) {
    if (Array.isArray(flags.exclude) && flags.exclude.length > 1) {
      // Get a diff between excluded and current if multiple provided
      dependencies = (0, _util.diff)(dependencies, flags.exclude);
    } else if (typeof flags.exclude === 'string') {
      // If only one dependency provided, exclude it from current dependencies
      dependencies = dependencies.filter(dep => dep !== flags.exclude);
    }
  }
  const promises = [];
  dependencies.forEach(dep => promises.push(getPackageDetails(dep)));
  const resolvedDeps = await Promise.all(promises);
  if (flags.export) {
    if (typeof flags.export === 'string') {
      const filename = _path.default.join(process.cwd(), flags.export);
      _promises.default.writeFile(filename, `${JSON.stringify(resolvedDeps, null, 2)}\n`);
      console.log(`Licenses exported to ${filename}`);
    } else if (typeof flags.export === 'boolean') {
      // Export to default licenses.json if no exported file name provided
      const filename = _path.default.join(process.cwd(), 'licenses.json');
      _promises.default.writeFile(filename, `${JSON.stringify(resolvedDeps, null, 2)}\n`);
      console.log(`Licenses exported to ${filename}`);
    }
  } else {
    // Otherwise just log output
    console.log(resolvedDeps);
  }
})();