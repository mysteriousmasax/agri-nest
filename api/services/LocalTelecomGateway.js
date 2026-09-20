const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');
require('dotenv').config();

const STORE_PATH = path.join(__dirname, '..', 'data', 'local-gateway.json');

function loadStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch (e) {
    return { messages: [], deliveries: [], airtime: [] };
  }
}

function saveStore(store) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

async function sendSms(toList, message) {
  const store = loadStore();
  const entries = [];
  for (const to of toList) {
    const id = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const record = { id, to, message, status: 'queued', createdAt: new Date().toISOString() };
    store.messages.push(record);
    entries.push(record);
  }
  saveStore(store);

  // Optionally call back to the app's delivery endpoint synchronously for testing
  try {
    const callbackUrl = process.env.LOCAL_GATEWAY_CALLBACK_URL || 'http://localhost:3000/communications/delivery-callback';
    for (const r of entries) {
      // mark delivered
      r.status = 'delivered';
      r.deliveredAt = new Date().toISOString();
      store.deliveries.push({ id: r.id, to: r.to, status: r.status, deliveredAt: r.deliveredAt });
      // POST callback
      fetch(callbackUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id, to: r.to, status: r.status }) }).catch(() => {});
    }
    saveStore(store);
  } catch (e) {
    // ignore callback errors
  }

  return { success: true, messages: entries };
}

async function sendVoiceCall({ phoneNumber, voiceMessage }) {
  const store = loadStore();
  const id = `call_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const record = { id, to: phoneNumber, message: voiceMessage, status: 'queued', createdAt: new Date().toISOString() };
  store.messages.push(record);
  store.deliveries.push({ id: record.id, to: record.to, status: 'queued' });
  saveStore(store);

  // Simulate immediate call and mark answered
  record.status = 'answered';
  record.answeredAt = new Date().toISOString();
  store.deliveries.push({ id: record.id, to: record.to, status: record.status, answeredAt: record.answeredAt });
  saveStore(store);

  // Notify app
  try {
    const callbackUrl = process.env.LOCAL_GATEWAY_CALLBACK_URL || 'http://localhost:3000/communications/delivery-callback';
    fetch(callbackUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: record.id, to: record.to, status: record.status, type: 'voice' }) }).catch(() => {});
  } catch (e) {}

  return { success: true, call: record };
}

async function sendAirtime({ phoneNumber, amount }) {
  const store = loadStore();
  const id = `air_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const record = { id, to: phoneNumber, amount, status: 'processed', createdAt: new Date().toISOString() };
  store.airtime.push(record);
  saveStore(store);

  // callback
  try {
    const callbackUrl = process.env.LOCAL_GATEWAY_CALLBACK_URL || 'http://localhost:3000/communications/delivery-callback';
    fetch(callbackUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: record.id, to: record.to, status: record.status, type: 'airtime' }) }).catch(() => {});
  } catch (e) {}

  return { success: true, airtime: record };
}

module.exports = { sendSms, sendVoiceCall, sendAirtime };
