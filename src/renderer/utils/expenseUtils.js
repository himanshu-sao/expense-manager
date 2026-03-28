export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#f97316' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📄', color: '#14b8a6' },
  { id: 'health', name: 'Health', icon: '💊', color: '#ef4444' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#06b6d4' },
  { id: 'education', name: 'Education', icon: '📚', color: '#f59e0b' },
  { id: 'other', name: 'Other', icon: '📦', color: '#6b7280' }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear()
  };
};

export const filterExpensesByMonth = (expenses, month, year) => {
  return expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

export const groupExpensesByCategory = (expenses) => {
  const grouped = {};
  expenses.forEach(expense => {
    if (!grouped[expense.category]) {
      grouped[expense.category] = [];
    }
    grouped[expense.category].push(expense);
  });
  return grouped;
};

export const calculateTotals = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};
