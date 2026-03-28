import { useState, useEffect, useCallback } from 'react';

const useStorage = (storageKey, loadFn, saveFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await loadFn();
        setData(result || {});
        setError(null);
      } catch (err) {
        setError(`Failed to load ${storageKey}`);
        console.error(`Error loading ${storageKey}:`, err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [loadFn, storageKey]);

  const saveData = useCallback(async (newData) => {
    try {
      await saveFn(newData);
      setData(newData);
      return true;
    } catch (err) {
      console.error(`Error saving ${storageKey}:`, err);
      return false;
    }
  }, [saveFn, storageKey]);

  const updateById = useCallback(async (id, updates) => {
    const newData = { ...data, [id]: { ...data[id], ...updates } };
    return await saveData(newData);
  }, [data, saveData]);

  const deleteById = useCallback(async (id) => {
    const newData = { ...data };
    delete newData[id];
    return await saveData(newData);
  }, [data, saveData]);

  const reset = useCallback(async () => {
    return await saveData({});
  }, [saveData]);

  return {
    data,
    loading,
    error,
    saveData,
    updateById,
    deleteById,
    reset,
    refresh: () => loadData()
  };
};

export const useCreditsUsed = () => {
  const { data, loading, error, updateById, deleteById, reset, refresh } = useStorage(
    'credits used',
    window.electronAPI.loadCreditsUsed,
    window.electronAPI.saveCreditsUsed
  );

  const updateCardCredits = useCallback(async (cardId, cardCredits) => {
    const newData = { ...data, [cardId]: cardCredits };
    try {
      await window.electronAPI.saveCreditsUsed(newData);
      return true;
    } catch (err) {
      console.error('Error saving credits:', err);
      return false;
    }
  }, [data]);

  return {
    creditsUsed: data,
    loading,
    error,
    updateCardCredits,
    resetCardCredits: deleteById,
    refreshCredits: refresh
  };
};

export const useCategorySpending = () => {
  const { data, loading, error, saveData, refresh } = useStorage(
    'category spending',
    window.electronAPI.loadCategorySpending,
    window.electronAPI.saveCategorySpending
  );

  const updateCategorySpend = useCallback(async (cardId, category, amount) => {
    const newData = {
      ...data,
      [cardId]: { ...(data?.[cardId] || {}), [category]: amount }
    };
    return await saveData(newData);
  }, [data, saveData]);

  const resetCategorySpend = useCallback(async (cardId) => {
    const newData = { ...data };
    delete newData[cardId];
    return await saveData(newData);
  }, [data, saveData]);

  return {
    categorySpending: data,
    loading,
    error,
    updateCategorySpend,
    resetCategorySpend,
    resetAllSpending: reset,
    refreshSpending: refresh
  };
};

export const useMonthlySpend = () => {
  const { data, loading, error, saveData, refresh } = useStorage(
    'monthly spend',
    window.electronAPI.loadMonthlySpend,
    window.electronAPI.saveMonthlySpend
  );

  const updateCategorySpend = useCallback(async (cardId, category, amount) => {
    const newData = {
      ...data,
      [cardId]: { ...(data?.[cardId] || {}), [category]: amount }
    };
    return await saveData(newData);
  }, [data, saveData]);

  const resetCardSpend = useCallback(async (cardId) => {
    const newData = { ...data };
    delete newData[cardId];
    return await saveData(newData);
  }, [data, saveData]);

  return {
    monthlySpend: data,
    loading,
    error,
    updateCategorySpend,
    resetCardSpend,
    resetAllSpend: reset,
    refreshSpend: refresh
  };
};
