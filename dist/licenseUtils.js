"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.licenseSnippets = exports.isValidLicense = void 0;
const validLicense = ['MIT', 'BSD', 'Apache License', 'Creative Commons', 'GPL', 'Apache-2.0', 'BSD-3-Clause', 'ISC'];
const licenseSnippets = ['MIT License', 'The GNU General Public License is a free, copyleft license for software and other kinds of works.'];
exports.licenseSnippets = licenseSnippets;
const isValidLicense = license => validLicense.some(i => i === license);
exports.isValidLicense = isValidLicense;