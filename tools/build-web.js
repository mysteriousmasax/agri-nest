const fs = require('fs-extra');
const path = require('path');

const src = path.resolve(__dirname, '..', 'app');
const dest = path.resolve(__dirname, '..', 'www');

try {
  fs.removeSync(dest);
  fs.copySync(src, dest, { overwrite: true });
  console.log('Copied app -> www');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
