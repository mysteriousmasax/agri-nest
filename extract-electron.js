const extract = require('extract-zip');
const path = require('path');
const zip = path.resolve('C:/Users/DODOMA COMPUTERS TEC/AppData/Local/electron/Cache/bc06643938ec02f64d13e092d6b48dd6a249308e4555428b6fe7b6cd073a5883/electron-v26.2.0-win32-x64.zip');
const dest = path.resolve('node_modules', 'electron', 'dist');

console.log('ZIP', zip);
console.log('DEST', dest);

extract(zip, { dir: dest }, (err) => {
  if (err) {
    console.error('ERR', err);
    process.exit(1);
  }
  console.log('EXTRACTED');
});
