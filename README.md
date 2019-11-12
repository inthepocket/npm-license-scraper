# License Validator

Dead simple license validator

## Usage

Until we publish to npm, add this to your `package.json`'s dev dependencies:

```json
"license-checker": "github:inthepocket/license-checker"
```

Then run it via npm/npx/shell:

```shell
$ node node_modules/license-checker
```

## CLI Options

- `--export [filename]`: Export to a JSON file. If no name provided this will export `licenses.json` in the current working directory
- `--includeDev`: Include dev dependencies in output
- `--exclude [package|package,package,package]`: Ignore certain packages from the check (e.g submodules, monorepo or private packages)
