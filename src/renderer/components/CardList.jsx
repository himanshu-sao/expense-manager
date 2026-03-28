import React from 'react';
import { getIssuerById, getRewardTypeById, calculateBreakEven, formatCurrency, MONTHS } from '../utils/cardUtils';

const CardItem = ({ card, onDelete }) => {
  const issuer = getIssuerById(card.issuer);
  const rewardType = getRewardTypeById(card.rewardType);
  const breakEven = calculateBreakEven(card);

  const valueColors = {
    excellent: 'bg-green-500/20 text-green-400 border-green-500/30',
    good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fair: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    poor: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const valueLabels = {
    excellent: 'Net Credit',
    good: 'Good Value',
    fair: 'Fair Value',
    poor: 'High Cost'
  };

  return (
    <div className="bg-slate-800/50 hover:bg-slate-800 rounded-xl p-5 border border-slate-700 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
            style={{ backgroundColor: issuer.color }}
          >
            {issuer.logo}
          </div>
          <div>
            <h4 className="font-semibold text-white">{card.name}</h4>
            <p className="text-sm text-slate-400">{issuer.name} • {rewardType.name}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Annual Fee</p>
          <p className="text-xl font-bold text-white">{formatCurrency(card.annualFee)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Renewal</p>
          <p className="text-xl font-bold text-white">{MONTHS[card.renewalMonth]}</p>
        </div>
      </div>

      <div className={`rounded-lg p-3 mb-4 border ${valueColors[breakEven.valueRating]}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{valueLabels[breakEven.valueRating]}</span>
          <span className="text-lg font-bold">
            {breakEven.isBreakEven ? '+' : '-'}{formatCurrency(Math.abs(breakEven.netAnnualFee))}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs opacity-80">
          <span>Credits: {formatCurrency(breakEven.totalCreditsValue)}</span>
          <span>Net: {formatCurrency(breakEven.annualFee - breakEven.totalCreditsValue)}</span>
        </div>
      </div>

      {card.credits && card.credits.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Credits & Benefits:</p>
          <div className="flex flex-wrap gap-2">
            {card.credits.map((credit, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                {credit.name}
                {credit.amount > 0 && <span className="text-indigo-400 ml-1">${credit.amount}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {card.currentPoints > 0 && (
        <div className="pt-3 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Current Points Balance</span>
            <span className="text-lg font-bold text-indigo-400">
              {card.currentPoints.toLocaleString()} pts
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const CardList = ({ cards, onDelete }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-4xl">💳</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No credit cards added</h3>
        <p className="text-slate-400">Add your first card to start tracking</p>
      </div>
    );
  }

  const sortedCards = [...cards].sort((a, b) => {
    const breakEvenA = calculateBreakEven(a);
    const breakEvenB = calculateBreakEven(b);
    return breakEvenB.valueRating.localeCompare(breakEvenA.valueRating);
  });

  const totalAnnualFees = cards.reduce((sum, card) => sum + card.annualFee, 0);
  const totalCredits = cards.reduce((sum, card) => {
    const be = calculateBreakEven(card);
    return sum + be.totalCreditsValue;
  }, 0);
  const totalPoints = cards.reduce((sum, card) => sum + (card.currentPoints || 0), 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-slate-400">Total Annual Fees</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalAnnualFees)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-slate-400">Total Credits Value</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalCredits)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-slate-400">Total Points Balance</p>
          <p className="text-2xl font-bold text-indigo-400">{totalPoints.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sortedCards.map(card => (
          <CardItem key={card.id} card={card} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
