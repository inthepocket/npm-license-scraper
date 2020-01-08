#! /usr/bin/env node

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { isValidLicense, licenseSnippets } from './licenseUtils';
import { parseCLIFlags, diff } from './util';
import { getPackageDescriptor, getPackageInfo, getDependencies } from './packageUtils';


async function readFromLicenseFile(basePath: string) {
  const matches = await promisify(fs.readdir)(basePath);
  const validLicenseFiles = matches.filter(match => match.toUpperCase().startsWith('LICENSE'));

  if (validLicenseFiles.length < 1) {
    console.log(`No valid license files found in ${basePath}`);
    return null;
  }

  const licenseFile = path.join(basePath, validLicenseFiles[0]);
  const contents = (await promisify(fs.readFile)(licenseFile)).toString();

  const snippetMatches = licenseSnippets.map(snippet => new RegExp(snippet).exec(contents));

  const file = licenseFile.split('node_modules/')[1];

  return {
    file,
    contents,
  };
}

async function getPackageDetails(dep: string) {
  const { basePath, pkg } = await getPackageDescriptor(dep);

  const info = getPackageInfo(pkg);
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
    license: isValidLicense(info.license) ? info.license : 'UNKNOWN',
    isValid: isValidLicense(info.license),
  };
}

(async () => {
  const flags = parseCLIFlags(process.argv);

  let [dependencies, devDependencies] = await getDependencies(Boolean(flags.includeDev));

  if (devDependencies !== null) {
    dependencies = [...dependencies, ...devDependencies];
  }

  if (flags.exclude) {
    if (Array.isArray(flags.exclude) && flags.exclude.length > 1) {
      // Get a diff between excluded and current if multiple provided
      dependencies = diff(dependencies, flags.exclude);
    } else if (typeof flags.exclude === 'boolean') {
      // If only one flag provided, exclude it from current dependencies
      // @ts-ignore
      dependencies = dependencies.filter(dep => dep !== (flags.exclude));
    }
  }

  const promises: Array<ReturnType<typeof getPackageDetails>> = [];
  dependencies.forEach(dep => promises.push(getPackageDetails(dep)));
  const resolvedDeps = await Promise.all(promises);

  if (flags.export) {
    if (typeof flags.export === 'string') {
      const filename = path.join(process.cwd(), flags.export);
      promisify(fs.writeFile)(filename, JSON.stringify(resolvedDeps, null, 2));
      console.log(`Licenses exported to ${filename}`);
    } else if (typeof flags.export === 'boolean') {
      // Export to default licenses.json if no exported file name provided
      const filename = path.join(process.cwd(), 'licenses.json');
      promisify(fs.writeFile)(filename, JSON.stringify(resolvedDeps, null, 2));
      console.log(`Licenses exported to ${filename}`);
    }
  } else {
    // Otherwise just log output
    console.log(resolvedDeps);
  }
})();
