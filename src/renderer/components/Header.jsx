import React from 'react';
import { formatCurrency } from '../utils/expenseUtils';

const Header = ({ totalSpent, monthName, totalAnnualFees, totalCreditsValue, showCardStats }) => {
  if (showCardStats) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Credit Card Manager</h1>
            <p className="text-emerald-200 text-sm mt-1">Track annual fees, credits & break-even</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-emerald-200 text-sm">Total Annual Fees</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalAnnualFees || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-200 text-sm">Credits Value</p>
              <p className="text-2xl font-bold text-emerald-300">{formatCurrency(totalCreditsValue || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-200 text-sm">Net Cost</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency((totalAnnualFees || 0) - (totalCreditsValue || 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expense Manager</h1>
          <p className="text-violet-200 text-sm mt-1">{monthName}</p>
        </div>
        <div className="text-right">
          <p className="text-violet-200 text-sm">Total Spent</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalSpent)}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
