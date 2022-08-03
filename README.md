<div align="center">
  <br />
  <h2 align="center">📜</h2>
  <h3 align="center">npm-license-scraper</h3>
  <p align="center">

Dead simple license scraper and validator with zero dependencies.
  </p>
</div>

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
- `--includeDev`: Include dev dependencies in output (default `true`)
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
