<img src="./banner.png" alt="NPM license scraper by In The Pocket" width="100%">

### 📜 Dead simple license scraper with zero dependencies

[![npm](https://img.shields.io/npm/v/@inthepocket/npm-license-scraper)](https://www.npmjs.com/package/@inthepocket/npm-license-scraper)
![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)

## Introduction

`npm-license-scraper` will scan your `package.json` and `node_modules` to generate a JSON file including the licenses of all open source packages that are being used.

## Usage

```shell
$ npm i -D @inthepocket/npm-license-scraper

# Via npx
$ npx npm-license-scraper

# Directly
$ node node_modules/.bin/npm-license-scraper
```

### Options

- `--export [filename]`: Export to a JSON file. (default `./licenses.json`)
- `--includeDev`: Include dev dependencies in output (default `false`)
- `--exclude [package|package,package,package]`: Ignore certain packages from the check (e.g submodules, monorepo or private packages)

## Output format

The exported JSON file has the following format:

```ts
type JSON = Array<{
  name: string;
  version: string;
  license: string;
  url: string;
  isValid: boolean;
}>;
```

Example:

```json
[
  {
    "package": "react",
    "version": "18.0.0",
    "license": "MIT",
    "url": "https://reactjs.org/",
    "isValid": true
  },
  {
    "package": "react-native",
    "version": "0.69.3",
    "license": "MIT",
    "url": "https://npmjs.com/package/react-native",
    "isValid": true
  }
]
```
