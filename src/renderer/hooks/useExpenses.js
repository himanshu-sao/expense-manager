import { useState, useEffect, useCallback } from 'react';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.loadExpenses();
      setExpenses(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveExpenses = useCallback(async (newExpenses) => {
    try {
      const result = await window.electronAPI.saveExpenses(newExpenses);
      if (!result.success) {
        throw new Error(result.error);
      }
      return true;
    } catch (err) {
      setError('Failed to save expenses');
      console.error(err);
      return false;
    }
  }, []);

  const addExpense = useCallback(async (expense) => {
    const newExpenses = [expense, ...expenses];
    setExpenses(newExpenses);
    return await saveExpenses(newExpenses);
  }, [expenses, saveExpenses]);

  const updateExpense = useCallback(async (id, updates) => {
    const newExpenses = expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    );
    setExpenses(newExpenses);
    return await saveExpenses(newExpenses);
  }, [expenses, saveExpenses]);

  const deleteExpense = useCallback(async (id) => {
    const newExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(newExpenses);
    return await saveExpenses(newExpenses);
  }, [expenses, saveExpenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: loadExpenses
  };
};
