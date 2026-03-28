import React, { useMemo } from 'react';
import { getIssuerById, formatCurrency, MONTHS } from '../utils/cardUtils';

const AnnualFeeReminder = ({ cards }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const renewalData = useMemo(() => {
    return cards.map(card => {
      const issuer = getIssuerById(card.issuer);
      let renewalDate = new Date(currentYear, card.renewalMonth - 1, 1);
      
      if (renewalDate < now) {
        renewalDate = new Date(currentYear + 1, card.renewalMonth - 1, 1);
      }

      const daysUntilRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
      const monthsUntilRenewal = Math.ceil(daysUntilRenewal / 30);

      return {
        ...card,
        issuer,
        renewalDate,
        daysUntilRenewal,
        monthsUntilRenewal
      };
    }).sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
  }, [cards, currentYear, now]);

  const upcomingRenewals = renewalData.filter(c => c.monthsUntilRenewal <= 3);
  const urgentRenewals = renewalData.filter(c => c.daysUntilRenewal <= 30);
  const totalUpcomingFees = upcomingRenewals.reduce((sum, c) => sum + c.annualFee, 0);

  const getUrgencyLevel = (days) => {
    if (days <= 14) return 'critical';
    if (days <= 30) return 'urgent';
    if (days <= 60) return 'warning';
    if (days <= 90) return 'notice';
    return 'normal';
  };

  const urgencyStyles = {
    critical: {
      bg: 'bg-red-600',
      text: 'text-white',
      label: 'Renewal Imminent',
      badge: 'bg-red-500'
    },
    urgent: {
      bg: 'bg-orange-600',
      text: 'text-white',
      label: 'Renewal Soon',
      badge: 'bg-orange-500'
    },
    warning: {
      bg: 'bg-yellow-600',
      text: 'text-black',
      label: 'Renewal Upcoming',
      badge: 'bg-yellow-500'
    },
    notice: {
      bg: 'bg-blue-600',
      text: 'text-white',
      label: 'Renewal This Quarter',
      badge: 'bg-blue-500'
    },
    normal: {
      bg: 'bg-slate-600',
      text: 'text-white',
      label: 'Renewal Later',
      badge: 'bg-slate-500'
    }
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {urgentRenewals.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Upcoming Annual Fee Payments</h3>
                <p className="text-sm text-white/80">
                  {formatCurrency(totalUpcomingFees)} due in the next 3 months
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{urgentRenewals.length}</p>
              <p className="text-sm text-white/80">Cards</p>
            </div>
          </div>

          <div className="space-y-2">
            {urgentRenewals.map(card => {
              const urgency = getUrgencyLevel(card.daysUntilRenewal);
              const styles = urgencyStyles[urgency];
              
              return (
                <div 
                  key={card.id}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                    style={{ backgroundColor: card.issuer.color }}
                  >
                    {card.issuer.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{card.name}</p>
                    <p className="text-sm text-white/70">
                      Renews {MONTHS[card.renewalDate.getMonth()]} {card.renewalDate.getFullYear()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{formatCurrency(card.annualFee)}</p>
                    <p className={`text-sm font-medium ${
                      card.daysUntilRenewal <= 14 ? 'text-red-200' : 
                      card.daysUntilRenewal <= 30 ? 'text-orange-200' : 'text-white/70'
                    }`}>
                      {card.daysUntilRenewal === 0 ? 'Today!' :
                       card.daysUntilRenewal === 1 ? 'Tomorrow' :
                       `${card.daysUntilRenewal} days`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles.text} ${styles.badge}`}>
                    {styles.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📅</span> Annual Fee Schedule
          </h3>
          <span className="text-sm text-slate-400">{currentYear} - {currentYear + 1}</span>
        </div>

        <div className="space-y-3">
          {renewalData.map(card => {
            const urgency = getUrgencyLevel(card.daysUntilRenewal);
            const styles = urgencyStyles[urgency];
            
            return (
              <div 
                key={card.id}
                className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="relative">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ backgroundColor: card.issuer.color }}
                  >
                    {card.issuer.logo}
                  </div>
                  {card.daysUntilRenewal <= 30 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-white">{card.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-400">
                      {MONTHS[card.renewalDate.getMonth()]} {card.renewalDate.getFullYear()}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-sm text-slate-400">
                      {card.daysUntilRenewal} days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${styles.text} ${styles.bg}`}>
                    {styles.label}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatCurrency(card.annualFee)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Annual Fees</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Per Year</span>
              <span className="text-2xl font-bold text-white">
                {formatCurrency(cards.reduce((sum, c) => sum + c.annualFee, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Legend</h4>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(urgencyStyles).map(([key, styles]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${styles.badge}`} />
              <span className="text-xs text-slate-400">{styles.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeeReminderBanner = ({ cards }) => {
  const now = new Date();

  const upcomingFees = useMemo(() => {
    return cards.filter(card => {
      let renewalDate = new Date(now.getFullYear(), card.renewalMonth - 1, 1);
      if (renewalDate < now) {
        renewalDate = new Date(now.getFullYear() + 1, card.renewalMonth - 1, 1);
      }
      const daysUntil = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
      return daysUntil <= 60;
    }).sort((a, b) => {
      let aDate = new Date(now.getFullYear(), a.renewalMonth - 1, 1);
      if (aDate < now) aDate = new Date(now.getFullYear() + 1, a.renewalMonth - 1, 1);
      let bDate = new Date(now.getFullYear(), b.renewalMonth - 1, 1);
      if (bDate < now) bDate = new Date(now.getFullYear() + 1, b.renewalMonth - 1, 1);
      return aDate - bDate;
    });
  }, [cards, now]);

  if (upcomingFees.length === 0) {
    return null;
  }

  const totalDue = upcomingFees.reduce((sum, c) => sum + c.annualFee, 0);

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2">
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">💳</span>
          <span className="text-amber-100">
            <strong>{upcomingFees.length}</strong> card{upcomingFees.length !== 1 ? 's' : ''} renewing soon
          </span>
        </div>
        <div className="h-4 w-px bg-amber-400/50" />
        <div className="text-amber-100">
          <strong>{formatCurrency(totalDue)}</strong> in annual fees due
        </div>
        <div className="h-4 w-px bg-amber-400/50" />
        <span className="text-amber-200">
          Next: {upcomingFees[0].name} ({MONTHS[upcomingFees[0].renewalMonth - 1]})
        </span>
      </div>
    </div>
  );
};

export { AnnualFeeReminder, FeeReminderBanner };
