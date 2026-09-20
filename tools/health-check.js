const fs = require('fs');
const path = require('path');

const baseUrl = process.argv[2] || 'http://localhost:8080';
const routerPath = path.resolve(__dirname, '..', 'app', 'assets', 'js', 'router.js');

function timeoutFetch(url, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(id));
}

async function run() {
  if (!fs.existsSync(routerPath)) {
    console.error('Router file not found:', routerPath);
    process.exit(2);
  }

  const content = fs.readFileSync(routerPath, 'utf8');
  const matches = [...content.matchAll(/['\"]([^'\"]+pages\/[^'\"]+\.html)['\"]/g)];
  const paths = new Set(matches.map(m => m[1]));
  // Always check index
  paths.add('index.html');

  const results = [];

  console.log(`Checking ${paths.size} routes on ${baseUrl}`);

  for (const p of paths) {
    const url = baseUrl.replace(/\/$/, '') + '/' + p.replace(/^\.\//, '');
    process.stdout.write(`GET ${url} ... `);
    try {
      const res = await timeoutFetch(url, 8000);
      if (res && res.ok) {
        console.log('OK', res.status);
        results.push({ path: p, ok: true, status: res.status });
      } else if (res) {
        console.log('FAIL', res.status);
        results.push({ path: p, ok: false, status: res.status });
      } else {
        console.log('NO RESPONSE');
        results.push({ path: p, ok: false, status: null });
      }
    } catch (err) {
      const msg = err && err.name === 'AbortError' ? 'TIMEOUT' : (err && err.message) || String(err);
      console.log('ERROR', msg);
      results.push({ path: p, ok: false, error: msg });
    }
  }

  const failed = results.filter(r => !r.ok);
  console.log('\nSummary:');
  console.log(`  Total: ${results.length}`);
  console.log(`  Passed: ${results.length - failed.length}`);
  console.log(`  Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed routes:');
    failed.forEach(f => console.log(' -', f.path, f.status || f.error));
    process.exit(1);
  }

  console.log('\nAll routes responded OK.');
  process.exit(0);
}

run();
