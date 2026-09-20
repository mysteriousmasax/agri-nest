require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, shell, ipcMain } = require('electron');

const isDev = process.env.NODE_ENV !== 'production';
const LOG_FILE = path.join(app.getPath('userData'), 'startup.log');
const HF_MODEL = process.env.HF_MODEL || 'google/flan-t5-large';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const HF_API_KEY = process.env.HF_API_KEY || '';

function writeLog(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch (error) {
    console.error('Failed to write startup log:', error);
  }
  console.log(line.trim());
}

process.on('uncaughtException', (error) => {
  writeLog(`uncaughtException: ${error.stack || error}`);
});

process.on('unhandledRejection', (reason) => {
  writeLog(`unhandledRejection: ${reason}`);
});

function createWindow() {
  writeLog('Creating main window');

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0b2314',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    writeLog('Main window ready to show');
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    writeLog('Renderer finished loading');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    writeLog(`did-fail-load: code=${errorCode} desc=${errorDescription} url=${validatedURL} mainFrame=${isMainFrame}`);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    writeLog(`render-process-gone: reason=${details.reason}`);
  });

  mainWindow.webContents.on('crashed', () => {
    writeLog('Renderer crashed');
  });

  if (isDev && process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

async function queryOpenSourceAI(question) {
  if (!HF_API_KEY) {
    throw new Error('Missing HF_API_KEY; set it in your environment or .env file.');
  }

  const prompt = `You are Agri-NEST Assistant, an experienced agriculture advisor for East Africa. Answer in a polite customer-facing way for farmers, traders, transporters, extension officers, or agribusiness staff. Use clear, practical advice about crop prices, weather, storage, pest control, inputs, logistics, and local markets. If the question is in Swahili, answer in Swahili. If it is in English, answer in simple, professional English. Question: ${question}`;

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.3,
        return_full_text: false,
      },
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || JSON.stringify(result));
  }

  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text;
  }
  if (result.generated_text) {
    return result.generated_text;
  }
  if (typeof result === 'string') {
    return result;
  }

  throw new Error('Unexpected AI response format.');
}

ipcMain.handle('ai:query', async (event, question) => {
  writeLog(`AI query received: ${question}`);
  try {
    const answer = await queryOpenSourceAI(question);
    writeLog('AI query completed successfully');
    return { answer };
  } catch (error) {
    writeLog(`AI query failed: ${error.message || error}`);
    return { error: error.message || 'AI model request failed' };
  }
});

app.whenReady().then(() => {
  writeLog('App is ready');
  createWindow();

  app.on('activate', () => {
    writeLog('App activate event');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  writeLog('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
