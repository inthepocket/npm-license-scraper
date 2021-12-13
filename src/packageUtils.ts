import path from 'path';

import { readJSONFile } from './util';

function hasProp(o: Record<string, any>, prop: string) {
  return Object.prototype.hasOwnProperty.call(o, prop)
}

/**
 * Returns the dependencies for the project's package.json.
 * By default returns both dependencies and dev dependencies as a tuple.
 * If false is passed, will return a tuple with only the dependencies
 */
export async function getDependencies(includeDev = true): Promise<[string[], string[] | null]> {
  try {
    const pkg = await readJSONFile(path.join(process.cwd(), 'package.json'));

    if (!hasProp(pkg, 'dependencies')) {
      if (!includeDev || !hasProp(pkg, 'devDependencies')) {
        console.error('Your project does not contain any dependencies');
        process.exit(1);
      }

      return [[], Object.keys(pkg.devDependencies)];
    }

    return includeDev
      ? [Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)]
      : [Object.keys(pkg.dependencies), null];
  } catch (error) {
    console.log('Could not get dependencies from package.json:', error);
    return process.exit(1);
  }
}

/**
 * Returns descriptor (basepath and package.json content) for a package
 */
export async function getPackageDescriptor(dep: string) {
  const basePath = path.join(process.cwd(), 'node_modules', dep);
  const pkg = await readJSONFile(path.join(basePath, 'package.json'));
  return { basePath, pkg };
}

/**
 * Returns metadata for package.json content
 */
export function getPackageInfo(pkg: PackageJSON): PackageInfo {
  const [url] = [pkg.homepage, pkg.repository?.url, pkg.repository?.baseUrl, pkg.repo]
    .filter(Boolean)
    .filter(url => url.startsWith('https'));

  return {
    version: pkg.version,
    license: pkg.license,
    url,
  };
}
