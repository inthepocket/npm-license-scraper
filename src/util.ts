import fs from 'fs';
import { promisify } from "util";

/**
 * Creates a nice object of flags from Node's process.argv
 */
export function parseCLIFlags(args: typeof process.argv, verbose = false): CLIFlags {
  const flags = args
    .filter(a => a.startsWith('--'))
    .reduce((a, b) => {
      if (verbose) {
        console.log(`🚩 Got CLI flag: ${b}`);
      }

      const flag = b.split('=');

      const key = flag[0].replace('--', '');
      const value = flag.length > 1 ? flag[1].split(',') : true;

      return {
        ...a,
        [key]: (Array.isArray(value) && value.length === 1) ? value[0] : value,
      };
    }, {});

  return flags;
};

/**
 * Returns the differences between 2 arrays
 */
export function diff(a: any[], b: any[]) {
  return [...new Set(a.filter(i => !new Set(b).has(i)))];
};

/**
 * Safely read a file and parse it as JSON
 */
export async function readJSONFile(filePath: string) {
  try {
    const fileBuffer = await promisify(fs.readFile)(filePath);
    return JSON.parse(fileBuffer.toString());
  } catch (error) {
    console.error('Could not read JSON file:', error);
    throw error;
  }
}
