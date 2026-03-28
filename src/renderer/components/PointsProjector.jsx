import React, { useState, useMemo } from 'react';
import { getIssuerById, getRewardTypeById, formatCurrency } from '../utils/cardUtils';

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

const CategorySpendInput = ({ category, rate, currentSpend, onUpdate }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{category}</p>
        <p className="text-xs text-indigo-400">{rate}x earning rate</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-400">$</span>
        <input
          type="number"
          value={currentSpend || ''}
          onChange={(e) => onUpdate(parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-24 bg-slate-600 border border-slate-500 rounded px-3 py-1.5 text-white text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-xs text-slate-400">/mo</span>
      </div>
    </div>
  );
};

const PointsProjectorCard = ({ card, monthlySpend, onUpdateCategory }) => {
  const issuer = getIssuerById(card.issuer);
  const rewardType = getRewardTypeById(card.rewardType);
  const cpp = POINTS_VALUATIONS[card.rewardType] || 1.0;

  const projection = useMemo(() => {
    let annualPoints = 0;
    let annualSpend = 0;
    const categoryBreakdown = [];

    card.earnRates?.forEach(rate => {
      const monthly = monthlySpend?.[rate.category] || 0;
      const annual = monthly * 12;
      const points = annual * rate.rate;
      annualPoints += points;
      annualSpend += annual;
      categoryBreakdown.push({
        category: rate.category,
        monthly,
        annual,
        rate: rate.rate,
        points
      });
    });

    const cashValue = (annualPoints * cpp / 100);

    return { annualPoints, annualSpend, categoryBreakdown, cashValue };
  }, [card.earnRates, monthlySpend, cpp]);

  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
          style={{ backgroundColor: issuer.color }}
        >
          {issuer.logo}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{card.name}</h4>
          <p className="text-sm text-slate-400">{rewardType.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-400">
            {projection.annualPoints.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400">pts/year</p>
        </div>
      </div>

      <div className="bg-indigo-500/10 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-300">Estimated Value</span>
          <span className="text-lg font-bold text-indigo-300">
            {formatCurrency(projection.cashValue)}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Based on {cpp}¢ per point valuation
        </p>
      </div>

      <div className="space-y-2">
        {card.earnRates?.map((rate, idx) => (
          <CategorySpendInput
            key={idx}
            category={rate.category}
            rate={rate.rate}
            currentSpend={monthlySpend?.[rate.category]}
            onUpdate={(amount) => onUpdateCategory(card.id, rate.category, amount)}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Total Annual Spend</span>
          <span className="text-white font-medium">{formatCurrency(projection.annualSpend)}</span>
        </div>
      </div>
    </div>
  );
};

const PointsProjectorSummary = ({ cards, allMonthlySpend }) => {
  const summary = useMemo(() => {
    const totals = {
      annualPoints: 0,
      annualSpend: 0,
      byRewardType: {}
    };

    cards.forEach(card => {
      const cardSpend = allMonthlySpend?.[card.id] || {};
      const cpp = POINTS_VALUATIONS[card.rewardType] || 1.0;

      let cardPoints = 0;
      let cardSpendTotal = 0;

      card.earnRates?.forEach(rate => {
        const monthly = cardSpend[rate.category] || 0;
        cardPoints += monthly * 12 * rate.rate;
        cardSpendTotal += monthly * 12;
      });

      totals.annualPoints += cardPoints;
      totals.annualSpend += cardSpendTotal;

      if (!totals.byRewardType[card.rewardType]) {
        totals.byRewardType[card.rewardType] = { points: 0, value: 0 };
      }
      totals.byRewardType[card.rewardType].points += cardPoints;
      totals.byRewardType[card.rewardType].value += cardPoints * cpp / 100;
    });

    totals.totalValue = Object.values(totals.byRewardType).reduce((sum, t) => sum + t.value, 0);

    return totals;
  }, [cards, allMonthlySpend]);

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Points Projector Summary</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{summary.annualPoints.toLocaleString()}</p>
          <p className="text-xs text-emerald-200">Total Points/Year</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.annualSpend)}</p>
          <p className="text-xs text-emerald-200">Total Spend/Year</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-300">{formatCurrency(summary.totalValue)}</p>
          <p className="text-xs text-emerald-200">Estimated Value</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {summary.annualSpend > 0 ? Math.round(summary.totalValue / summary.annualSpend * 100) : 0}%
          </p>
          <p className="text-xs text-emerald-200">Return Rate</p>
        </div>
      </div>

      {Object.keys(summary.byRewardType).length > 0 && (
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-sm font-medium text-emerald-200 mb-2">Points by Program</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.byRewardType).map(([type, data]) => {
              const rewardType = getRewardTypeById(type);
              return (
                <span key={type} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                  {rewardType.name}: {data.points.toLocaleString()} pts ({formatCurrency(data.value)})
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const PointsProjector = ({ cards, monthlySpend, onUpdateCategory }) => {
  const [showAllCards, setShowAllCards] = useState(false);

  const displayedCards = showAllCards ? cards : cards.slice(0, 2);
  const totalAnnualValue = useMemo(() => {
    let total = 0;
    cards.forEach(card => {
      const cpp = POINTS_VALUATIONS[card.rewardType] || 1.0;
      const cardSpend = monthlySpend?.[card.id] || {};
      card.earnRates?.forEach(rate => {
        const monthly = cardSpend[rate.category] || 0;
        total += monthly * 12 * rate.rate * cpp / 100;
      });
    });
    return total;
  }, [cards, monthlySpend]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-4xl">🎯</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No cards to project</h3>
        <p className="text-slate-400">Add credit cards to project points earnings</p>
      </div>
    );
  }

  return (
    <div>
      <PointsProjectorSummary cards={cards} allMonthlySpend={monthlySpend} />
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        {displayedCards.map(card => (
          <PointsProjectorCard
            key={card.id}
            card={card}
            monthlySpend={monthlySpend?.[card.id]}
            onUpdateCategory={onUpdateCategory}
          />
        ))}
      </div>

      {cards.length > 2 && (
        <button
          onClick={() => setShowAllCards(!showAllCards)}
          className="w-full mt-4 py-3 text-center text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {showAllCards ? 'Show less' : `Show ${cards.length - 2} more cards`}
        </button>
      )}
    </div>
  );
};

export { PointsProjector, PointsProjectorSummary };
