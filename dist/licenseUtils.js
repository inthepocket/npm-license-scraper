"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidLicense = isValidLicense;
exports.licenseSnippets = void 0;
const validLicense = ['MIT', 'BSD', 'Apache License', 'Creative Commons', 'GPL', 'Apache-2.0', 'BSD-3-Clause', "ISC"];
const licenseSnippets = ['MIT License', 'The GNU General Public License is a free, copyleft license for software and other kinds of works.'];
exports.licenseSnippets = licenseSnippets;

function isValidLicense(license) {
  return validLicense.some(i => i === license);
}