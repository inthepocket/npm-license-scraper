import path from 'path';

import { readJSONFile } from './util';

function hasProp(o: Record<string, any>, prop: string) {
  return Object.prototype.hasOwnProperty.call(o, prop);
}

/**
 * Returns the dependencies for the project's package.json.
 * By default returns both dependencies and dev dependencies as a tuple.
 * If false is passed, will return a tuple with only the dependencies
 */
export async function getDependencies(
  includeDev: boolean,
): Promise<[string[], string[] | null]> {
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
 * Returns descriptor (basePath and package.json content) for a package
 * Emulating node js module resolution (see: https://medium.com/outbrain-engineering/node-js-module-resolution-af46715784ef)
 */
export async function getPackageDescriptor(
    dep: string,
    basePath = process.cwd(),
    basePathTries: string[] = []
  ): Promise<{
  basePath: string;
  pkg: any;
}> {
  try {
    const pkg = await readJSONFile(path.join(basePath, 'node_modules', dep, 'package.json'), false);

    return { 
      pkg,
      basePath: path.join(basePath, 'node_modules', dep),
    };
  } catch (error) {
    basePathTries = [...basePathTries, path.join(basePath, 'node_modules', dep)];

    if (basePath === '/') {
      console.error(`Could not find package: '${dep}', tried: \n\t${basePathTries.join('\n\t')}`);
      return process.exit(1);
    }

    return getPackageDescriptor(dep, path.join(basePath, '..'), basePathTries);
  }
}

/**
 * Returns metadata for package.json content
 */
export function getPackageInfo(pkg: PackageJSON) {
  const [url] = [
    pkg.homepage,
    pkg.repository?.url,
    pkg.repository?.baseUrl,
    pkg.repo,
  ]
    .filter(Boolean)
    .filter((url) => url?.startsWith('https'));

  return {
    version: pkg.version,
    license: pkg.license,
    url: url ?? `https://npmjs.com/package/${pkg.name}`,
  };
}
