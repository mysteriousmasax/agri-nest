(async function(){
  const statusEl = document.getElementById('status');
  const lastScanEl = document.getElementById('lastScan');
  const toggleBtn = document.getElementById('toggleBtn');
  const token = window.localStorage.getItem('agri-nest-superadmin-token') || prompt('Enter super admin token to control detection:');
  if(token) window.localStorage.setItem('agri-nest-superadmin-token', token);

  async function loadStatus(){
    const res = await fetch('/security/status', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ superAdminToken: token }) });
    const json = await res.json();
    if(json.success){
      statusEl.textContent = `Enabled: ${json.enabled} — Incidents: ${json.incidentCount}`;
      lastScanEl.textContent = JSON.stringify(json.lastScan, null, 2);
    } else {
      statusEl.textContent = `Error: ${json.error || JSON.stringify(json)}`;
    }
  }

  toggleBtn.addEventListener('click', async ()=>{
    const newState = !((await (await fetch('/security/status',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({ superAdminToken: token })})).then(r=>r.json())).enabled);
    const res = await fetch('/security/configure', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ enabled: newState, superAdminToken: token }) });
    const json = await res.json();
    if(json.success) loadStatus(); else alert('Failed: '+JSON.stringify(json));
  });

  loadStatus();
})();
