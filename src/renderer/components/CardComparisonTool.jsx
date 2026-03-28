import React, { useState, useMemo } from 'react';
import { getIssuerById, getRewardTypeById, formatCurrency, MONTHS } from '../utils/cardUtils';

const POINTS_VALUATIONS = {
  membership_rewards: 2.0,
  ultimate_rewards: 2.0,
  thankyou_points: 1.6,
  bilt_points: 2.2,
  capital_one_miles: 1.4,
  hilton_points: 0.6,
  marriott_points: 0.8,
  delta_miles: 1.2,
  united_miles: 1.2,
  cash_back: 1.0
};

const CardComparisonTool = ({ cards }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [categorySpending, setCategorySpending] = useState({});

  const toggleCard = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const comparisonData = useMemo(() => {
    return selectedCards.map(cardId => {
      const card = cards.find(c => c.id === cardId);
      if (!card) return null;
      
      const issuer = getIssuerById(card.issuer);
      const rewardType = getRewardTypeById(card.rewardType);
      const cpp = POINTS_VALUATIONS[card.rewardType] || 1.0;

      let estimatedPoints = 0;
      let estimatedValue = 0;
      
      card.earnRates?.forEach(rate => {
        const spend = categorySpending[rate.category] || 0;
        const points = spend * 12 * rate.rate;
        estimatedPoints += points;
        estimatedValue += points * cpp / 100;
      });

      const totalCredits = card.credits?.reduce((sum, c) => {
        if (c.frequency === 'included' || c.amount === 0) return sum;
        return sum + c.amount;
      }, 0) || 0;

      const netValue = estimatedValue + totalCredits - card.annualFee;

      return {
        ...card,
        issuer,
        rewardType,
        cpp,
        estimatedPoints,
        estimatedValue,
        totalCredits,
        netValue,
        netValuePerDollar: card.annualFee > 0 ? (netValue / card.annualFee).toFixed(2) : 'N/A'
      };
    }).filter(Boolean);
  }, [selectedCards, cards, categorySpending]);

  const bestForCategory = useMemo(() => {
    const categories = {};
    
    selectedCards.forEach(cardId => {
      const card = cards.find(c => c.id === cardId);
      if (!card) return;
      
      card.earnRates?.forEach(rate => {
        if (!categories[rate.category]) {
          categories[rate.category] = { rate: 0, cards: [] };
        }
        if (rate.rate > categories[rate.category].rate) {
          categories[rate.category] = { rate: rate.rate, cards: [card.name] };
        } else if (rate.rate === categories[rate.category].rate) {
          categories[rate.category].cards.push(card.name);
        }
      });
    });
    
    return categories;
  }, [selectedCards, cards]);

  const handleSpendChange = (category, value) => {
    setCategorySpending(prev => ({
      ...prev,
      [category]: parseInt(value) || 0
    }));
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-4xl">⚖️</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No cards to compare</h3>
        <p className="text-slate-400">Add credit cards to compare them side by side</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Select Cards to Compare (max 3)</h3>
        <div className="flex flex-wrap gap-2">
          {cards.map(card => {
            const issuer = getIssuerById(card.issuer);
            const isSelected = selectedCards.includes(card.id);
            const isDisabled = !isSelected && selectedCards.length >= 3;
            
            return (
              <button
                key={card.id}
                onClick={() => toggleCard(card.id)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : isDisabled
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <span 
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: issuer.color }}
                >
                  {issuer.logo}
                </span>
                {card.name}
                {isSelected && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCards.length >= 2 && (
        <>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Spending by Category</h3>
            <p className="text-sm text-slate-400 mb-4">Enter your monthly spending to calculate earnings</p>
            <div className="grid grid-cols-3 gap-3">
              {[...new Set(cards.flatMap(c => c.earnRates?.map(r => r.category) || []))].map(category => (
                <div key={category} className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 w-28">{category}</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={categorySpending[category] || ''}
                      onChange={(e) => handleSpendChange(category, e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 overflow-x-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Side-by-Side Comparison</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Feature</th>
                  {comparisonData.map(card => (
                    <th key={card.id} className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                          style={{ backgroundColor: card.issuer.color }}
                        >
                          {card.issuer.logo}
                        </div>
                        <span className="font-semibold text-white">{card.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-slate-400">Annual Fee</td>
                  {comparisonData.map(card => (
                    <td key={card.id} className="py-3 px-4 text-center">
                      <span className="text-white font-semibold">{formatCurrency(card.annualFee)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-slate-400">Renewal Month</td>
                  {comparisonData.map(card => (
                    <td key={card.id} className="py-3 px-4 text-center">
                      <span className="text-white">{MONTHS[card.renewalMonth]}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-slate-400">Total Credits</td>
                  {comparisonData.map(card => (
                    <td key={card.id} className="py-3 px-4 text-center">
                      <span className={`font-semibold ${card.totalCredits > 0 ? 'text-green-400' : 'text-slate-400'}`}>
                        {formatCurrency(card.totalCredits)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-slate-400">Estimated Points/Year</td>
                  {comparisonData.map(card => (
                    <td key={card.id} className="py-3 px-4 text-center">
                      <span className="text-indigo-400 font-semibold">{card.estimatedPoints.toLocaleString()}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4 text-slate-400">Estimated Value</td>
                  {comparisonData.map(card => (
                    <td key={card.id} className="py-3 px-4 text-center">
                      <span className="text-emerald-400 font-semibold">{formatCurrency(card.estimatedValue)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700 bg-indigo-500/10">
                  <td className="py-3 px-4 text-indigo-400 font-semibold">Net Value</td>
                  {comparisonData.map((card, idx) => {
                    const isBest = Math.max(...comparisonData.map(c => c.netValue)) === card.netValue;
                    return (
                      <td key={card.id} className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-xl font-bold ${card.netValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {card.netValue >= 0 ? '+' : ''}{formatCurrency(card.netValue)}
                          </span>
                          {isBest && comparisonData.length > 1 && (
                            <span className="text-xs text-indigo-400 mt-1">🏆 Best Value</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {Object.keys(bestForCategory).length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">🏆 Best Cards by Category</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(bestForCategory).map(([category, data]) => (
                  <div key={category} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-white">{category}</p>
                      <p className="text-sm text-slate-400">{data.cards.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-400">{data.rate}x</p>
                      <p className="text-xs text-slate-400">earning rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selectedCards.length < 2 && selectedCards.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 text-center">
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-lg font-medium text-white mb-2">Select at least 2 cards to compare</h3>
          <p className="text-slate-400">Choose up to 3 cards to see a detailed side-by-side comparison</p>
        </div>
      )}
    </div>
  );
};

export { CardComparisonTool };
