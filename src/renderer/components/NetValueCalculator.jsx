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

const NetValueCard = ({ card, monthlySpend, onUpdateSpend }) => {
  const issuer = getIssuerById(card.issuer);
  const rewardType = getRewardTypeById(card.rewardType);
  const cpp = POINTS_VALUATIONS[card.rewardType] || 1.0;

  const analysis = useMemo(() => {
    let estimatedPoints = 0;
    let estimatedValue = 0;
    const categoryBreakdown = [];

    card.earnRates?.forEach(rate => {
      const spend = monthlySpend?.[rate.category] || 0;
      const annualSpend = spend * 12;
      const points = annualSpend * rate.rate;
      const value = points * cpp / 100;
      estimatedPoints += points;
      estimatedValue += value;
      categoryBreakdown.push({ category: rate.category, spend, points, value, rate: rate.rate });
    });

    const annualCredits = card.credits?.reduce((sum, c) => {
      if (c.frequency === 'included' || c.amount === 0) return sum;
      return sum + c.amount;
    }, 0) || 0;

    const netValue = estimatedValue + annualCredits - card.annualFee;
    const roi = card.annualFee > 0 ? (netValue / card.annualFee) * 100 : 0;
    const monthlyCost = card.annualFee / 12;
    const dailyCost = card.annualFee / 365;

    return {
      estimatedPoints,
      estimatedValue,
      annualCredits,
      netValue,
      roi,
      monthlyCost,
      dailyCost,
      categoryBreakdown
    };
  }, [card, monthlySpend, cpp]);

  const getValueRating = () => {
    if (analysis.netValue >= card.annualFee * 2) return { label: 'Exceptional', color: 'text-green-400', bg: 'bg-green-500' };
    if (analysis.netValue >= card.annualFee) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (analysis.netValue >= 0) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500' };
    if (analysis.netValue >= -card.annualFee * 0.5) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const rating = getValueRating();

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <div className={`${rating.bg} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white bg-white/20">
              {issuer.logo}
            </div>
            <div>
              <h4 className="font-bold text-white">{card.name}</h4>
              <p className="text-sm text-white/80">{rewardType.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${rating.color}`}>
              {analysis.netValue >= 0 ? '+' : ''}{formatCurrency(analysis.netValue)}
            </p>
            <p className="text-sm text-white/80">Net Value/Year</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <p className="text-2xl font-bold text-red-400">-{formatCurrency(card.annualFee)}</p>
            <p className="text-xs text-slate-400 mt-1">Annual Fee</p>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <p className="text-2xl font-bold text-green-400">+{formatCurrency(analysis.annualCredits)}</p>
            <p className="text-xs text-slate-400 mt-1">Credits</p>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <p className="text-2xl font-bold text-indigo-400">{analysis.estimatedPoints.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Points/Year</p>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(analysis.estimatedValue)}</p>
            <p className="text-xs text-slate-400 mt-1">Points Value</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Monthly Cost</span>
            <span className="text-white font-medium">{formatCurrency(analysis.monthlyCost)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Daily Cost</span>
            <span className="text-white font-medium">{formatCurrency(analysis.dailyCost)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">ROI on Annual Fee</span>
            <span className={`font-bold ${analysis.roi >= 100 ? 'text-green-400' : analysis.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {analysis.roi >= 0 ? '+' : ''}{analysis.roi.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Renewal Date</span>
            <span className="text-white font-medium">{MONTHS[card.renewalMonth - 1]}</span>
          </div>
        </div>

        {analysis.categoryBreakdown.length > 0 && (
          <div className="border-t border-slate-700 pt-4">
            <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Earnings by Category</h5>
            <div className="space-y-2">
              {analysis.categoryBreakdown.filter(c => c.spend > 0).map((cat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-slate-300 truncate">{cat.category}</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min((cat.points / Math.max(...analysis.categoryBreakdown.map(c => c.points || 1))) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm">
                    <span className="text-indigo-400">{cat.points.toLocaleString()}</span>
                    <span className="text-slate-500 text-xs"> pts</span>
                  </div>
                  <div className="w-16 text-right text-sm text-emerald-400">{formatCurrency(cat.value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Monthly Spend Input</h5>
          <div className="grid grid-cols-2 gap-2">
            {card.earnRates?.map((rate, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-20 truncate">{rate.category}</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    value={monthlySpend?.[rate.category] || ''}
                    onChange={(e) => onUpdateSpend(card.id, rate.category, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-6 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NetValueCalculator = ({ cards, monthlySpend, onUpdateSpend }) => {
  const totalAnalysis = useMemo(() => {
    let totalFees = 0;
    let totalCredits = 0;
    let totalPoints = 0;
    let totalValue = 0;

    const cpp = POINTS_VALUATIONS;

    cards.forEach(card => {
      totalFees += card.annualFee;
      
      const annualCredits = card.credits?.reduce((sum, c) => {
        if (c.frequency === 'included' || c.amount === 0) return sum;
        return sum + c.amount;
      }, 0) || 0;
      totalCredits += annualCredits;

      card.earnRates?.forEach(rate => {
        const spend = monthlySpend?.[card.id]?.[rate.category] || 0;
        const points = spend * 12 * rate.rate;
        const value = points * (cpp[card.rewardType] || 1.0) / 100;
        totalPoints += points;
        totalValue += value;
      });
    });

    const netValue = totalValue + totalCredits - totalFees;
    const roi = totalFees > 0 ? (netValue / totalFees) * 100 : 0;

    return { totalFees, totalCredits, totalPoints, totalValue, netValue, roi };
  }, [cards, monthlySpend]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-4xl">🧮</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No cards added</h3>
        <p className="text-slate-400">Add credit cards to calculate net value</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Net Value Summary</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{cards.length}</p>
            <p className="text-xs text-indigo-200">Cards</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-300">-{formatCurrency(totalAnalysis.totalFees)}</p>
            <p className="text-xs text-indigo-200">Total Fees</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-300">+{formatCurrency(totalAnalysis.totalCredits)}</p>
            <p className="text-xs text-indigo-200">Credits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-200">{totalAnalysis.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-indigo-200">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-300">+{formatCurrency(totalAnalysis.totalValue)}</p>
            <p className="text-xs text-indigo-200">Points Value</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-200">Net Portfolio Value</p>
              <p className={`text-3xl font-bold ${totalAnalysis.netValue >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {totalAnalysis.netValue >= 0 ? '+' : ''}{formatCurrency(totalAnalysis.netValue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-200">Portfolio ROI</p>
              <p className={`text-3xl font-bold ${totalAnalysis.roi >= 100 ? 'text-green-300' : totalAnalysis.roi >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {totalAnalysis.roi >= 0 ? '+' : ''}{totalAnalysis.roi.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map(card => (
          <NetValueCard
            key={card.id}
            card={card}
            monthlySpend={monthlySpend?.[card.id]}
            onUpdateSpend={onUpdateSpend}
          />
        ))}
      </div>
    </div>
  );
};

export { NetValueCalculator };
