# License Validator

Dead simple license validator

## Usage

```shell
$ npm i -D @inthepocket/npm-license-scraper

# Via npx
$ npx npm-license-scraper

# Directly
$ node node_modules/.bin/npm-license-scraper
```

## CLI Options

- `--export [filename]`: Export to a JSON file. If no name provided this will export `licenses.json` in the current working directory
- `--includeDev`: Include dev dependencies in output
- `--exclude [package|package,package,package]`: Ignore certain packages from the check (e.g submodules, monorepo or private packages)
