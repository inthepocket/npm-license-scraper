#!/usr/bin/env bash
set -euo pipefail

assert_contains() {
  local file="$1"
  local pattern="$2"
  if ! grep -q "$pattern" "$file"; then
    echo "FAIL: '$file' does not contain '$pattern'"
    exit 1
  fi
}

npm run build

# Console output
echo "Testing console output..."
node dist/index.js --includeDev > console-output.txt
assert_contains console-output.txt "typescript"
assert_contains console-output.txt "license:"
assert_contains console-output.txt "isValid:"
rm -f console-output.txt

# JSON export
echo "Testing JSON export..."
node dist/index.js --includeDev --export=licenses.json
node -e "
  const data = require('./licenses.json');
  if (!Array.isArray(data)) throw new Error('Expected array');
  if (data.length === 0) throw new Error('Expected non-empty array');
  const required = ['package', 'version', 'license', 'url', 'isValid'];
  for (const key of required) {
    if (!(key in data[0])) throw new Error('Missing key: ' + key);
  }
  const expected = {
    'typescript': 'Apache-2.0',
    '@babel/core': 'MIT',
    '@babel/cli': 'MIT',
    '@babel/preset-env': 'MIT',
    '@babel/preset-typescript': 'MIT',
  };
  for (const [pkg, license] of Object.entries(expected)) {
    const entry = data.find(d => d.package === pkg);
    if (!entry) throw new Error('Missing package: ' + pkg);
    if (entry.license !== license) throw new Error(pkg + ': expected ' + license + ', got ' + entry.license);
    if (entry.isValid !== true) throw new Error(pkg + ': expected isValid to be true');
    if (!entry.version) throw new Error(pkg + ': missing version');
    if (!entry.url) throw new Error(pkg + ': missing url');
  }
  console.log('JSON content verified: ' + data.length + ' packages, ' + Object.keys(expected).length + ' licenses checked');
"

# TypeScript export
echo "Testing TypeScript export..."
node dist/index.js --includeDev --export=licenses.ts
assert_contains licenses.ts "as const"
assert_contains licenses.ts "export const licenses"
assert_contains licenses.ts "export type License"
assert_contains licenses.ts "typescript"
assert_contains licenses.ts "@babel/core"

echo "Type-checking generated TypeScript..."
npx tsc --noEmit --strict --skipLibCheck licenses.ts

rm -f licenses.json licenses.ts

echo "All tests passed!"
