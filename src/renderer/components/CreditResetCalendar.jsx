import React, { useMemo } from 'react';
import { getIssuerById, CREDIT_FREQUENCIES, formatCurrency } from '../utils/cardUtils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CreditResetCalendar = ({ cards, creditsUsed }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const calendarData = useMemo(() => {
    const events = [];
    
    cards.forEach(card => {
      const issuer = getIssuerById(card.issuer);
      
      card.credits?.forEach(credit => {
        if (credit.frequency === 'included') return;
        
        const freq = CREDIT_FREQUENCIES[credit.frequency] || CREDIT_FREQUENCIES.annual;
        const isTrackable = credit.amount > 0;
        
        let nextReset = getNextResetDate(credit.frequency, now);
        
        const getNextResetDate = (frequency, fromDate) => {
          const date = new Date(fromDate);
          
          if (frequency === 'monthly') {
            date.setMonth(date.getMonth() + 1);
            date.setDate(1);
          } else if (frequency === 'quarterly') {
            const currentQuarter = Math.floor(date.getMonth() / 3);
            date.setMonth((currentQuarter + 1) * 3);
            date.setDate(1);
            if (date <= fromDate) {
              date.setFullYear(date.getFullYear() + 1);
            }
          } else if (frequency === 'semi-annual') {
            const currentHalf = Math.floor(date.getMonth() / 6);
            date.setMonth((currentHalf + 1) * 6);
            date.setDate(1);
            if (date <= fromDate) {
              date.setFullYear(date.getFullYear() + 1);
            }
          } else if (frequency === 'annual') {
            date.setFullYear(date.getFullYear() + 1);
            date.setDate(1);
          }
          
          return date;
        };

        events.push({
          cardId: card.id,
          cardName: card.name,
          issuerLogo: issuer.logo,
          issuerColor: issuer.color,
          creditName: credit.name,
          creditAmount: credit.amount,
          frequency: credit.frequency,
          frequencyLabel: freq.label,
          isTrackable,
          nextReset,
          daysUntilReset: Math.ceil((nextReset - now) / (1000 * 60 * 60 * 24)),
          cardAnnualFee: card.annualFee,
          isRenewal: false
        });
      });

      const renewalDate = new Date(currentYear, card.renewalMonth - 1, 1);
      if (renewalDate < now) {
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
      }

      events.push({
        cardId: card.id,
        cardName: card.name,
        issuerLogo: issuer.logo,
        issuerColor: issuer.color,
        creditName: 'Annual Fee',
        creditAmount: card.annualFee,
        frequency: 'annual',
        frequencyLabel: 'Annual',
        isTrackable: false,
        nextReset: renewalDate,
        daysUntilReset: Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24)),
        cardAnnualFee: card.annualFee,
        isRenewal: true
      });
    });

    return events.sort((a, b) => a.nextReset - b.nextReset);
  }, [cards, creditsUsed, now]);

  const upcomingEvents = calendarData.filter(e => e.daysUntilReset <= 90);
  const currentMonthEvents = calendarData.filter(e => {
    return e.nextReset.getMonth() === currentMonth && e.nextReset.getFullYear() === currentYear;
  });

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getEventsForDay = (day) => {
    return calendarData.filter(e => 
      e.nextReset.getDate() === day && 
      e.nextReset.getMonth() === currentMonth &&
      e.nextReset.getFullYear() === currentYear
    );
  };

  const getUrgencyColor = (days) => {
    if (days <= 7) return 'bg-red-500';
    if (days <= 14) return 'bg-orange-500';
    if (days <= 30) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Credit Reset Calendar</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{upcomingEvents.filter(e => e.daysUntilReset <= 7).length}</p>
            <p className="text-xs text-violet-200">This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{upcomingEvents.filter(e => e.daysUntilReset <= 30).length}</p>
            <p className="text-xs text-violet-200">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{formatCurrency(upcomingEvents.filter(e => e.isTrackable).reduce((sum, e) => sum + e.creditAmount, 0))}</p>
            <p className="text-xs text-violet-200">Credits Resetting</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">{MONTHS[currentMonth]} {currentYear}</h4>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 bg-slate-700/20 rounded" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDay(day);
            const isToday = now.getDate() === day && now.getMonth() === currentMonth;
            
            return (
              <div 
                key={day} 
                className={`h-20 rounded-lg p-1 ${isToday ? 'bg-indigo-500/30 ring-2 ring-indigo-500' : 'bg-slate-700/30'} relative`}
              >
                <span className={`text-xs font-medium ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>{day}</span>
                <div className="mt-1 space-y-0.5 overflow-hidden">
                  {events.slice(0, 2).map((event, idx) => (
                    <div 
                      key={idx}
                      className={`text-xs px-1 py-0.5 rounded truncate ${event.isRenewal ? 'bg-amber-500/80 text-white' : 'bg-slate-600 text-slate-200'}`}
                      title={`${event.creditName} - ${event.frequencyLabel}`}
                    >
                      {event.isRenewal ? '💳' : '💰'} {event.creditAmount > 0 ? formatCurrency(event.creditAmount) : event.creditName}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-slate-500">+{events.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">Upcoming Resets</h4>
        <div className="space-y-3">
          {upcomingEvents.slice(0, 10).map((event, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
            >
              <div className={`w-2 h-12 rounded-full ${getUrgencyColor(event.daysUntilReset)}`} />
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: event.issuerColor }}
              >
                {event.issuerLogo}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{event.cardName}</p>
                <p className="text-sm text-slate-400">
                  {event.creditName} ({event.frequencyLabel})
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${event.isRenewal ? 'text-amber-400' : event.creditAmount > 0 ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {event.isRenewal ? formatCurrency(event.cardAnnualFee) : event.creditAmount > 0 ? formatCurrency(event.creditAmount) : ''}
                </p>
                <p className={`text-xs ${event.daysUntilReset <= 7 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                  {event.daysUntilReset === 0 ? 'Today!' : 
                   event.daysUntilReset === 1 ? 'Tomorrow' : 
                   `${event.daysUntilReset} days`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm text-slate-300">≤ 7 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-sm text-slate-300">≤ 14 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-sm text-slate-300">≤ 30 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm text-slate-300">&gt; 30 days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-sm text-slate-300">Annual Fee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreditResetCalendar };
