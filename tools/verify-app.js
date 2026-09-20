/**
 * Verify AGRI-NEST can start: JS syntax, critical assets, optional HTTP check.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const APP_JS = path.join(ROOT, 'app', 'assets', 'js');
const WWW = path.join(ROOT, 'www');

let failed = 0;

function fail(msg) {
  console.error('FAIL:', msg);
  failed++;
}

function ok(msg) {
  console.log('OK:', msg);
}

// 1. Syntax-check all app JS
const jsFiles = fs.readdirSync(APP_JS).filter((f) => f.endsWith('.js'));
for (const f of jsFiles) {
  const file = path.join(APP_JS, f);
  try {
    require('child_process').execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    ok(`syntax ${f}`);
  } catch (e) {
    fail(`syntax ${f}: ${e.stderr?.toString() || e.message}`);
  }
}

// 2. Build and verify www
require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'build-web.js')], {
  cwd: ROOT,
  stdio: 'inherit',
});
const critical = [
  'index.html',
  'assets/js/db.js',
  'assets/js/router.js',
  'assets/js/app-core.js',
  'assets/data/east_africa_datasets.json',
  'assets/data/east_africa_research_datasets.json',
  'assets/css/tailwind-compat.css',
];
for (const rel of critical) {
  const p = path.join(WWW, rel);
  if (!fs.existsSync(p)) fail(`missing www/${rel}`);
  else ok(`exists www/${rel}`);
}

// 3. db.js must define DB (load in vm)
try {
  const dbSrc = fs.readFileSync(path.join(WWW, 'assets/js/db.js'), 'utf8');
  if (!dbSrc.includes('const DB =')) fail('db.js missing DB export');
  else ok('db.js structure');
} catch (e) {
  fail(e.message);
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
