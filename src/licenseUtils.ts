const validLicense = [
  'MIT',
  'BSD',
  'Apache License',
  'Creative Commons',
  'GPL',
  'Apache-2.0',
  'BSD-3-Clause',
  "ISC"
];

export const licenseSnippets = [
  'MIT License',
  'The GNU General Public License is a free, copyleft license for software and other kinds of works.',
];

export function isValidLicense(license: string) {
  return validLicense.some(i => i === license);
}
