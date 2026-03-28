import React, { useState, useEffect } from 'react';
import { getIssuerById, CREDIT_FREQUENCIES, formatCurrency } from '../utils/cardUtils';

const CreditTrackerItem = ({ credit, onUpdate }) => {
  const [used, setUsed] = useState(credit.used || 0);
  
  const freq = CREDIT_FREQUENCIES[credit.frequency] || CREDIT_FREQUENCIES.annual;
  const maxAmount = credit.amount;
  const progress = maxAmount > 0 ? Math.min((used / maxAmount) * 100, 100) : 0;
  const remaining = Math.max(maxAmount - used, 0);
  
  const progressColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-yellow-500',
    poor: 'bg-slate-500'
  };
  
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-green-400';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-slate-600';
  };

  const handleIncrement = (amount) => {
    const newUsed = Math.min(used + amount, maxAmount);
    setUsed(newUsed);
    onUpdate({ ...credit, used: newUsed });
  };

  const handleReset = () => {
    setUsed(0);
    onUpdate({ ...credit, used: 0 });
  };

  if (credit.frequency === 'included') {
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <span className="text-emerald-400 text-sm">✓</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{credit.name}</p>
          <p className="text-xs text-slate-400">{credit.description}</p>
        </div>
        <span className="text-xs text-emerald-400 font-medium">Included</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-slate-700/30 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{credit.name}</p>
          <p className="text-xs text-slate-400">
            {freq.label} • {formatCurrency(maxAmount)} per {freq.periodLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-white">
            {formatCurrency(used)} / {formatCurrency(maxAmount)}
          </p>
          {remaining > 0 && (
            <p className="text-xs text-indigo-400">{formatCurrency(remaining)} remaining</p>
          )}
        </div>
      </div>
      
      <div className="relative h-2 bg-slate-600 rounded-full overflow-hidden mb-2">
        <div 
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
        {progress >= 100 && (
          <div className="absolute inset-0 bg-green-400 animate-pulse opacity-50" />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => handleIncrement(10)}
            className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
          >
            +$10
          </button>
          <button
            onClick={() => handleIncrement(25)}
            className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
          >
            +$25
          </button>
          <button
            onClick={() => handleIncrement(maxAmount)}
            className="px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
          >
            Max
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleIncrement(-10)}
            disabled={used < 10}
            className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            -$10
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 text-xs bg-red-600/50 hover:bg-red-600 text-white rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const CreditTracker = ({ card, creditsUsed, onUpdateCredits }) => {
  const [showAll, setShowAll] = useState(false);
  const issuer = getIssuerById(card.issuer);
  
  const trackableCredits = card.credits?.filter(c => c.frequency !== 'included') || [];
  const includedCredits = card.credits?.filter(c => c.frequency === 'included') || [];
  
  const totalCreditsValue = trackableCredits.reduce((sum, c) => sum + c.amount, 0);
  const totalUsed = trackableCredits.reduce((sum, c) => sum + (creditsUsed?.[c.name] || 0), 0);
  const totalRemaining = totalCreditsValue - totalUsed;
  
  const handleUpdateCredit = (creditName, updates) => {
    const newCreditsUsed = { ...creditsUsed, [creditName]: updates.used };
    onUpdateCredits(card.id, newCreditsUsed);
  };

  if (trackableCredits.length === 0) {
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
            <p className="text-xs text-slate-400">No trackable credits</p>
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
              {formatCurrency(totalUsed)} used of {formatCurrency(totalCreditsValue)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${totalRemaining <= 0 ? 'text-green-400' : 'text-white'}`}>
            {totalRemaining <= 0 ? '✓ Maxed' : formatCurrency(totalRemaining)}
          </p>
          <p className="text-xs text-slate-400">remaining</p>
        </div>
      </div>

      <div className="space-y-2">
        {trackableCredits.slice(0, showAll ? undefined : 2).map((credit, idx) => (
          <CreditTrackerItem
            key={idx}
            credit={{ ...credit, used: creditsUsed?.[credit.name] || 0 }}
            onUpdate={(updated) => handleUpdateCredit(credit.name, updated)}
          />
        ))}
      </div>

      {trackableCredits.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-2 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {showAll ? 'Show less' : `Show ${trackableCredits.length - 2} more credits`}
        </button>
      )}
    </div>
  );
};

const CreditTrackerSummary = ({ cards, allCreditsUsed }) => {
  const totalAvailable = cards.reduce((sum, card) => {
    const trackable = card.credits?.filter(c => c.frequency !== 'included') || [];
    return sum + trackable.reduce((s, c) => s + c.amount, 0);
  }, 0);
  
  const totalUsed = Object.values(allCreditsUsed || {}).reduce((sum, cardCredits) => {
    return sum + Object.values(cardCredits || {}).reduce((s, v) => s + v, 0);
  }, 0);
  
  const totalRemaining = totalAvailable - totalUsed;
  
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Credit Tracker Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{formatCurrency(totalAvailable)}</p>
          <p className="text-sm text-indigo-200">Total Available</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-300">{formatCurrency(totalUsed)}</p>
          <p className="text-sm text-indigo-200">Used</p>
        </div>
        <div className="text-center">
          <p className={`text-3xl font-bold ${totalRemaining <= 0 ? 'text-green-400' : 'text-yellow-300'}`}>
            {totalRemaining <= 0 ? '✓ All Used!' : formatCurrency(totalRemaining)}
          </p>
          <p className="text-sm text-indigo-200">Remaining</p>
        </div>
      </div>
      <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${totalAvailable > 0 ? (totalUsed / totalAvailable) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};

export { CreditTracker, CreditTrackerSummary };
