"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.parseCLIFlags = parseCLIFlags;
exports.readJSONFile = readJSONFile;
var _promises = _interopRequireDefault(require("fs/promises"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Creates a nice object of flags from Node's process.argv
 */
function parseCLIFlags(args, verbose = false) {
  const flags = args.filter(a => a.startsWith('--')).reduce((a, b) => {
    if (verbose) {
      console.log(`🚩 Got CLI flag: ${b}`);
    }
    const flag = b.split('=');
    const key = flag[0].replace('--', '');
    const value = flag.length > 1 ? flag[1].split(',') : true;
    return {
      ...a,
      [key]: Array.isArray(value) && value.length === 1 ? value[0] : value
    };
  }, {});
  return flags;
}
;

/**
 * Returns the differences between 2 arrays
 */
function diff(a, b) {
  return [...new Set(a.filter(i => !new Set(b).has(i)))];
}
;

/**
 * Safely read a file and parse it as JSON
 */
async function readJSONFile(filePath, outputFail = true) {
  try {
    const fileBuffer = await _promises.default.readFile(filePath);
    return JSON.parse(fileBuffer.toString());
  } catch (error) {
    if (outputFail) {
      console.error('Could not read JSON file:', error);
    }
    throw error;
  }
}