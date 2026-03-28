import { useState, useEffect, useCallback } from 'react';

export const useCreditCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.loadCards();
      setCards(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load credit cards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveCards = useCallback(async (newCards) => {
    try {
      const result = await window.electronAPI.saveCards(newCards);
      if (!result.success) {
        throw new Error(result.error);
      }
      return true;
    } catch (err) {
      setError('Failed to save credit cards');
      console.error(err);
      return false;
    }
  }, []);

  const addCard = useCallback(async (card) => {
    const newCards = [...cards, card];
    setCards(newCards);
    return await saveCards(newCards);
  }, [cards, saveCards]);

  const updateCard = useCallback(async (id, updates) => {
    const newCards = cards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    );
    setCards(newCards);
    return await saveCards(newCards);
  }, [cards, saveCards]);

  const deleteCard = useCallback(async (id) => {
    const newCards = cards.filter(card => card.id !== id);
    setCards(newCards);
    return await saveCards(newCards);
  }, [cards, saveCards]);

  return {
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    refreshCards: loadCards
  };
};
