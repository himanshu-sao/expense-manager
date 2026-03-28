import React, { useState, useEffect } from 'react';
import { getIssuerById, formatCurrency } from '../utils/cardUtils';

const SpendCapItem = ({ earnRate, currentSpend, onUpdate }) => {
  const hasCap = earnRate.cap && earnRate.cap > 0;
  const spent = currentSpend || 0;
  const cap = earnRate.cap || 0;
  const progress = hasCap ? Math.min((spent / cap) * 100, 100) : 0;
  const remaining = Math.max(cap - spent, 0);
  
  const getProgressColor = () => {
    if (!hasCap) return 'bg-slate-600';
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 80) return 'bg-red-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-indigo-500';
  };

  const getProgressBgColor = () => {
    if (!hasCap) return 'bg-slate-700';
    if (progress >= 100) return 'bg-green-500/20';
    if (progress >= 80) return 'bg-red-500/20';
    if (progress >= 60) return 'bg-yellow-500/20';
    if (progress >= 40) return 'bg-blue-500/20';
    return 'bg-indigo-500/20';
  };

  const getStatusBadge = () => {
    if (!hasCap) return null;
    if (progress >= 100) return { text: 'MAXED', class: 'bg-green-500 text-white' };
    if (progress >= 80) return { text: 'Almost Full', class: 'bg-red-500 text-white' };
    if (progress >= 60) return { text: 'Good Progress', class: 'bg-yellow-500 text-black' };
    return null;
  };

  const status = getStatusBadge();

  return (
    <div className={`p-4 rounded-xl border transition-all ${getProgressBgColor()} ${hasCap ? 'border-slate-600' : 'border-slate-700/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{earnRate.rate}x</span>
          <span className="text-sm text-slate-300">{earnRate.category}</span>
          {earnRate.region && (
            <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">{earnRate.region}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span className={`px-2 py-1 rounded text-xs font-bold ${status.class}`}>
              {status.text}
            </span>
          )}
          {hasCap && (
            <span className="text-sm font-semibold text-white">
              {formatCurrency(spent)} / {formatCurrency(cap)}
            </span>
          )}
        </div>
      </div>

      {earnRate.description && (
        <p className="text-xs text-slate-400 mb-3">{earnRate.description}</p>
      )}

      {hasCap && (
        <>
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
            {progress >= 100 && (
              <div className="absolute inset-0 bg-green-400 animate-pulse opacity-30" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => onUpdate(Math.min(spent + 500, cap))}
                className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
              >
                +$500
              </button>
              <button
                onClick={() => onUpdate(Math.min(spent + 1000, cap))}
                className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
              >
                +$1K
              </button>
              <button
                onClick={() => onUpdate(cap)}
                className="px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
              >
                Max
              </button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onUpdate(Math.max(spent - 500, 0))}
                disabled={spent < 500}
                className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                -$500
              </button>
              <button
                onClick={() => onUpdate(0)}
                className="px-2 py-1 text-xs bg-red-600/50 hover:bg-red-600 text-white rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {progress >= 80 && progress < 100 && (
            <p className="mt-3 text-xs text-red-400 flex items-center gap-1">
              <span>⚠️</span>
              Only {formatCurrency(remaining)} left before maxing out this category!
            </p>
          )}
        </>
      )}
    </div>
  );
};

const SpendCapTracker = ({ card, categorySpending, onUpdateCategory }) => {
  const issuer = getIssuerById(card.issuer);
  const cappedRates = card.earnRates?.filter(r => r.cap && r.cap > 0) || [];
  const uncappedRates = card.earnRates?.filter(r => !r.cap || r.cap === 0) || [];
  
  const totalCapValue = cappedRates.reduce((sum, r) => sum + r.cap, 0);
  const totalSpent = cappedRates.reduce((sum, r) => sum + (categorySpending?.[r.category] || 0), 0);
  const totalRemaining = totalCapValue - totalSpent;

  const handleUpdateSpend = (category, amount) => {
    onUpdateCategory(card.id, category, amount);
  };

  if (!card.earnRates || card.earnRates.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
            style={{ backgroundColor: issuer.color }}
          >
            {issuer.logo}
          </div>
          <div>
            <p className="font-medium text-white">{card.name}</p>
            <p className="text-xs text-slate-400">No earning categories</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
            style={{ backgroundColor: issuer.color }}
          >
            {issuer.logo}
          </div>
          <div>
            <p className="font-medium text-white">{card.name}</p>
            <p className="text-xs text-slate-400">
              {cappedRates.length > 0 
                ? `${formatCurrency(totalSpent)} of ${formatCurrency(totalCapValue)} capped spend`
                : 'No spend caps'}
            </p>
          </div>
        </div>
        {cappedRates.length > 0 && (
          <div className="text-right">
            <p className={`text-lg font-bold ${totalRemaining <= 0 ? 'text-green-400' : 'text-white'}`}>
              {totalRemaining <= 0 ? '✓ All Capped!' : formatCurrency(totalRemaining)}
            </p>
            <p className="text-xs text-slate-400">remaining</p>
          </div>
        )}
      </div>

      {cappedRates.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Capped Categories</h4>
          {cappedRates.map((rate, idx) => (
            <SpendCapItem
              key={idx}
              earnRate={rate}
              currentSpend={categorySpending?.[rate.category] || 0}
              onUpdate={(amount) => handleUpdateSpend(rate.category, amount)}
            />
          ))}
        </div>
      )}

      {uncappedRates.length > 0 && (
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Uncapped Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {uncappedRates.map((rate, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                <span className="text-lg font-bold text-indigo-400">{rate.rate}x</span>
                <span className="text-sm text-slate-300">{rate.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SpendCapSummary = ({ cards, allCategorySpending }) => {
  const allCappedCategories = [];
  
  cards.forEach(card => {
    card.earnRates?.filter(r => r.cap && r.cap > 0).forEach(rate => {
      const existing = allCappedCategories.find(c => c.category === rate.category);
      if (existing) {
        existing.cap += rate.cap;
        existing.spent += allCategorySpending?.[card.id]?.[rate.category] || 0;
      } else {
        allCappedCategories.push({
          category: rate.category,
          cap: rate.cap,
          spent: allCategorySpending?.[card.id]?.[rate.category] || 0,
          rate: rate.rate,
          cards: [card.name]
        });
      }
    });
  });

  const totalCap = allCappedCategories.reduce((sum, c) => sum + c.cap, 0);
  const totalSpent = allCappedCategories.reduce((sum, c) => sum + c.spent, 0);
  const nearFull = allCappedCategories.filter(c => c.spent >= c.cap * 0.8 && c.spent < c.cap);
  const maxed = allCappedCategories.filter(c => c.spent >= c.cap);

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Spend Cap Overview</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{allCappedCategories.length}</p>
          <p className="text-xs text-amber-200">Tracked Caps</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-amber-200">Total Spent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-300">{nearFull.length}</p>
          <p className="text-xs text-amber-200">Almost Full</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{maxed.length}</p>
          <p className="text-xs text-amber-200">Maxed Out</p>
        </div>
      </div>

      {nearFull.length > 0 && (
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-200 mb-2">⚠️ Almost at cap:</p>
          <div className="flex flex-wrap gap-2">
            {nearFull.map(cat => (
              <span key={cat.category} className="px-2 py-1 bg-yellow-500/30 rounded text-xs text-white">
                {cat.category}: {Math.round((cat.spent / cat.cap) * 100)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {maxed.length > 0 && (
        <div className="mt-3 bg-black/20 rounded-lg p-3">
          <p className="text-sm font-medium text-green-200 mb-2">✓ Maxed out:</p>
          <div className="flex flex-wrap gap-2">
            {maxed.map(cat => (
              <span key={cat.category} className="px-2 py-1 bg-green-500/30 rounded text-xs text-white">
                {cat.category}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { SpendCapTracker, SpendCapSummary };
