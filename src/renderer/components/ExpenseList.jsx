import React from 'react';
import { getCategoryById, formatCurrency, formatDate } from '../utils/expenseUtils';

const ExpenseItem = ({ expense, onDelete }) => {
  const category = getCategoryById(expense.category);

  return (
    <div className="group bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 transition-all duration-200 border border-slate-700/50 hover:border-slate-600">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {category.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">{expense.description}</h4>
          <p className="text-sm text-slate-400">{category.name} • {formatDate(expense.date)}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-white">{formatCurrency(expense.amount)}</p>
        </div>

        <button
          onClick={() => onDelete(expense.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No expenses yet</h3>
        <p className="text-slate-400">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map(expense => (
        <ExpenseItem 
          key={expense.id} 
          expense={expense} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
