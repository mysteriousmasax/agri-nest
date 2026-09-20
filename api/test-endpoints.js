const baseUrl = process.env.API_BASE || 'http://localhost:3000';

const tests = [
  {
    name: 'USSD welcome menu',
    url: '/communications/ussd',
    body: { sessionId: 'test-session', phoneNumber: '+255745759185', text: '' },
  },
  {
    name: 'Google login link',
    url: '/communications/google/login',
    body: { email: 'test@example.com', name: 'Test Farmer', phone: '+255745759185' },
  },
  {
    name: 'AI cyber threat scan',
    url: '/security/scan',
    body: { eventType: 'unauthorized_access', details: 'failed login from suspicious IP 102.23.45.67' },
  },
  {
    name: 'Cyber threat status',
    url: '/security/status',
    body: { superAdminToken: process.env.SUPER_ADMIN_TOKEN || 'superadmin-token-123' },
  },
];

async function runTest(test) {
  try {
    const response = await fetch(`${baseUrl}${test.url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test.body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log(`\n=== ${test.name} ===`);
    console.log(`URL: ${test.url}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
  } catch (error) {
    console.error(`\n=== ${test.name} FAILED ===`);
    console.error(error.message);
  }
}

(async () => {
  console.log(`Testing API endpoints against ${baseUrl}`);
  for (const test of tests) {
    await runTest(test);
  }
  console.log('\nAPI endpoint validation complete.');
})();
