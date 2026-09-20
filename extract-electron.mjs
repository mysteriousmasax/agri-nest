import extract from 'extract-zip';
import path from 'path';

const zip = 'C:/Users/DODOMA COMPUTERS TEC/AppData/Local/electron/Cache/bc06643938ec02f64d13e092d6b48dd6a249308e4555428b6fe7b6cd073a5883/electron-v26.2.0-win32-x64.zip';
const dest = path.resolve('node_modules', 'electron', 'dist');

(async () => {
  try {
    await extract(zip, { dir: dest });
    console.log('EXTRACTED');
  } catch (error) {
    console.error('ERR', error);
    process.exit(1);
  }
})();
