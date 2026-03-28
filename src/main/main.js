const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

log.transports.file.level = 'info';
log.transports.console.level = 'debug';
log.info('Application starting...');

let mainWindow;
let userDataPath = app.getPath('userData');
let dataFilePath = path.join(userDataPath, 'expenses.json');
let cardsFilePath = path.join(userDataPath, 'credit-cards.json');
let creditsUsedFilePath = path.join(userDataPath, 'credits-used.json');
let categorySpendingFilePath = path.join(userDataPath, 'category-spending.json');
let monthlySpendFilePath = path.join(userDataPath, 'monthly-spend.json');

function createWindow() {
  log.info('Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f172a',
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist-react/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  log.info('Main window created successfully');
}

app.whenReady().then(() => {
  log.info('App is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  log.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('load-expenses', async () => {
  log.info('Loading expenses from:', dataFilePath);
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    log.error('Error loading expenses:', error);
    return [];
  }
});

ipcMain.handle('save-expenses', async (event, expenses) => {
  log.info('Saving expenses...');
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
    log.info('Expenses saved successfully');
    return { success: true };
  } catch (error) {
    log.error('Error saving expenses:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-cards', async () => {
  log.info('Loading credit cards from:', cardsFilePath);
  try {
    if (fs.existsSync(cardsFilePath)) {
      const data = fs.readFileSync(cardsFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    log.error('Error loading credit cards:', error);
    return [];
  }
});

ipcMain.handle('save-cards', async (event, cards) => {
  log.info('Saving credit cards...');
  try {
    fs.writeFileSync(cardsFilePath, JSON.stringify(cards, null, 2));
    log.info('Credit cards saved successfully');
    return { success: true };
  } catch (error) {
    log.error('Error saving credit cards:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-credits-used', async () => {
  log.info('Loading credits used from:', creditsUsedFilePath);
  try {
    if (fs.existsSync(creditsUsedFilePath)) {
      const data = fs.readFileSync(creditsUsedFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    log.error('Error loading credits used:', error);
    return {};
  }
});

ipcMain.handle('save-credits-used', async (event, credits) => {
  log.info('Saving credits used...');
  try {
    fs.writeFileSync(creditsUsedFilePath, JSON.stringify(credits, null, 2));
    log.info('Credits used saved successfully');
    return { success: true };
  } catch (error) {
    log.error('Error saving credits used:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-category-spending', async () => {
  log.info('Loading category spending from:', categorySpendingFilePath);
  try {
    if (fs.existsSync(categorySpendingFilePath)) {
      const data = fs.readFileSync(categorySpendingFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    log.error('Error loading category spending:', error);
    return {};
  }
});

ipcMain.handle('save-category-spending', async (event, spending) => {
  log.info('Saving category spending...');
  try {
    fs.writeFileSync(categorySpendingFilePath, JSON.stringify(spending, null, 2));
    log.info('Category spending saved successfully');
    return { success: true };
  } catch (error) {
    log.error('Error saving category spending:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-monthly-spend', async () => {
  log.info('Loading monthly spend from:', monthlySpendFilePath);
  try {
    if (fs.existsSync(monthlySpendFilePath)) {
      const data = fs.readFileSync(monthlySpendFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    log.error('Error loading monthly spend:', error);
    return {};
  }
});

ipcMain.handle('save-monthly-spend', async (event, spending) => {
  log.info('Saving monthly spend...');
  try {
    fs.writeFileSync(monthlySpendFilePath, JSON.stringify(spending, null, 2));
    log.info('Monthly spend saved successfully');
    return { success: true };
  } catch (error) {
    log.error('Error saving monthly spend:', error);
    return { success: false, error: error.message };
  }
});

process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
