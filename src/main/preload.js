const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadExpenses: () => ipcRenderer.invoke('load-expenses'),
  saveExpenses: (expenses) => ipcRenderer.invoke('save-expenses', expenses),
  loadCards: () => ipcRenderer.invoke('load-cards'),
  saveCards: (cards) => ipcRenderer.invoke('save-cards', cards),
  loadCreditsUsed: () => ipcRenderer.invoke('load-credits-used'),
  saveCreditsUsed: (credits) => ipcRenderer.invoke('save-credits-used', credits),
  loadCategorySpending: () => ipcRenderer.invoke('load-category-spending'),
  saveCategorySpending: (spending) => ipcRenderer.invoke('save-category-spending', spending),
  loadMonthlySpend: () => ipcRenderer.invoke('load-monthly-spend'),
  saveMonthlySpend: (spending) => ipcRenderer.invoke('save-monthly-spend', spending)
});
