import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import MonthlySummary from './components/MonthlySummary';
import AddCardForm from './components/AddCardForm';
import CardList from './components/CardList';
import { CreditTracker, CreditTrackerSummary } from './components/CreditTracker';
import { SpendCapTracker, SpendCapSummary } from './components/SpendCapTracker';
import { PointsProjector } from './components/PointsProjector';
import { CreditResetCalendar } from './components/CreditResetCalendar';
import { AnnualFeeReminder, FeeReminderBanner } from './components/AnnualFeeReminder';
import { CardComparisonTool } from './components/CardComparisonTool';
import { NetValueCalculator } from './components/NetValueCalculator';
import { useExpenses } from './hooks/useExpenses';
import { useCreditCards } from './hooks/useCreditCards';
import { useCreditsUsed, useCategorySpending, useMonthlySpend } from './hooks/useStorage';
import { filterExpensesByMonth, calculateTotals, getCurrentMonthYear } from './utils/expenseUtils';
import { calculateBreakEven } from './utils/cardUtils';

const { month, year } = getCurrentMonthYear();
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function App() {
  const { expenses, loading: expensesLoading, error: expensesError, addExpense, deleteExpense } = useExpenses();
  const { cards, loading: cardsLoading, error: cardsError, addCard, deleteCard } = useCreditCards();
  const { creditsUsed, updateCardCredits } = useCreditsUsed();
  const { categorySpending, updateCategorySpend } = useCategorySpending();
  const { monthlySpend, updateCategorySpend: updateMonthlySpend } = useMonthlySpend();
  const [activeTab, setActiveTab] = useState('expenses');
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [cardTab, setCardTab] = useState('cards');

  const loading = expensesLoading || cardsLoading;
  const error = expensesError || cardsError;

  const currentMonthExpenses = useMemo(() => {
    return filterExpensesByMonth(expenses, selectedMonth, selectedYear);
  }, [expenses, selectedMonth, selectedYear]);

  const totalSpent = useMemo(() => {
    return calculateTotals(currentMonthExpenses);
  }, [currentMonthExpenses]);

  const totalAnnualFees = useMemo(() => {
    return cards.reduce((sum, card) => sum + card.annualFee, 0);
  }, [cards]);

  const totalCreditsValue = useMemo(() => {
    return cards.reduce((sum, card) => {
      const be = calculateBreakEven(card);
      return sum + be.totalCreditsValue;
    }, 0);
  }, [cards]);

  const handleAddExpense = async (expense) => {
    await addExpense(expense);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleAddCard = async (card) => {
    await addCard(card);
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteCard(id);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-red-400 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Header 
        totalSpent={totalSpent} 
        monthName={`${MONTHS[selectedMonth]} ${selectedYear}`}
        totalAnnualFees={activeTab === 'cards' ? totalAnnualFees : undefined}
        totalCreditsValue={activeTab === 'cards' ? totalCreditsValue : undefined}
        showCardStats={activeTab === 'cards'}
      />

      <div className="flex items-center gap-1 px-6 py-3 bg-slate-800/50 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          💰 Expenses
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'cards'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          💳 Credit Cards
        </button>
      </div>

      {activeTab === 'cards' && cards.length > 0 && (
        <FeeReminderBanner cards={cards} />
      )}

      {activeTab === 'expenses' && (
        <div className="flex-1 overflow-hidden flex">
          <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Expenses</h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[2023, 2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <AddExpenseForm onAdd={handleAddExpense} />
            
            <div className="mt-6">
              <ExpenseList expenses={currentMonthExpenses} onDelete={handleDeleteExpense} />
            </div>
          </div>

          <div className="w-1/2 p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-6">Analytics</h2>
            <MonthlySummary expenses={expenses} />
          </div>
        </div>
      )}

      {activeTab === 'cards' && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-1 px-6 py-2 bg-slate-800/80 border-b border-slate-700">
            <button
              onClick={() => setCardTab('cards')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'cards'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              💳 Cards
            </button>
            <button
              onClick={() => setCardTab('tracker')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'tracker'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              📊 Credits
            </button>
            <button
              onClick={() => setCardTab('spendcaps')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'spendcaps'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              💰 Spend Caps
            </button>
            <button
              onClick={() => setCardTab('projector')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'projector'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              🎯 Points Projector
            </button>
            <button
              onClick={() => setCardTab('breakdown')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'breakdown'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              📈 Break-Even
            </button>
            <button
              onClick={() => setCardTab('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setCardTab('compare')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'compare'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ⚖️ Compare
            </button>
            <button
              onClick={() => setCardTab('netvalue')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                cardTab === 'netvalue'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              💎 Net Value
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {cardTab === 'cards' && (
              <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">My Credit Cards</h2>
                </div>
                <AddCardForm onAdd={handleAddCard} onRefreshData={() => {}} />
                <div className="mt-6">
                  <CardList cards={cards} onDelete={handleDeleteCard} />
                </div>
              </div>
            )}

            {cardTab === 'tracker' && (
              <div className="w-full p-6 overflow-y-auto">
                <CreditTrackerSummary cards={cards} allCreditsUsed={creditsUsed} />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {cards.map(card => (
                    <CreditTracker
                      key={card.id}
                      card={card}
                      creditsUsed={creditsUsed?.[card.id]}
                      onUpdateCredits={updateCardCredits}
                    />
                  ))}
                </div>
                {cards.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                      <span className="text-4xl">💳</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No cards added</h3>
                    <p className="text-slate-400">Add credit cards to track credits</p>
                  </div>
                )}
              </div>
            )}

            {cardTab === 'spendcaps' && (
              <div className="w-full p-6 overflow-y-auto">
                <SpendCapSummary cards={cards} allCategorySpending={categorySpending} />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {cards.map(card => (
                    <SpendCapTracker
                      key={card.id}
                      card={card}
                      categorySpending={categorySpending?.[card.id]}
                      onUpdateCategory={updateCategorySpend}
                    />
                  ))}
                </div>
                {cards.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                      <span className="text-4xl">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No cards added</h3>
                    <p className="text-slate-400">Add credit cards to track spend caps</p>
                  </div>
                )}
              </div>
            )}

            {cardTab === 'projector' && (
              <div className="w-full p-6 overflow-y-auto">
                <PointsProjector 
                  cards={cards} 
                  monthlySpend={monthlySpend} 
                  onUpdateCategory={updateMonthlySpend} 
                />
              </div>
            )}

            {cardTab === 'calendar' && (
              <div className="w-full p-6 overflow-y-auto">
                <AnnualFeeReminder cards={cards} />
                <div className="mt-6">
                  <CreditResetCalendar cards={cards} creditsUsed={creditsUsed} />
                </div>
              </div>
            )}

            {cardTab === 'compare' && (
              <div className="w-full p-6 overflow-y-auto">
                <CardComparisonTool cards={cards} />
              </div>
            )}

            {cardTab === 'netvalue' && (
              <div className="w-full p-6 overflow-y-auto">
                <NetValueCalculator 
                  cards={cards} 
                  monthlySpend={monthlySpend}
                  onUpdateSpend={updateMonthlySpend}
                />
              </div>
            )}

            {cardTab === 'breakdown' && (
              <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-800">
                <BreakEvenAnalysis cards={cards} />
              </div>
            )}

            {(cardTab === 'cards' || cardTab === 'breakdown') && (
              <div className="w-1/2 p-6 overflow-y-auto">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {cardTab === 'cards' ? 'Break-Even Analysis' : 'Quick Stats'}
                </h2>
                <BreakEvenAnalysis cards={cards} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BreakEvenAnalysis({ cards }) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="text-4xl">📊</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No cards to analyze</h3>
        <p className="text-slate-400">Add credit cards to see break-even analysis</p>
      </div>
    );
  }

  const cardAnalysis = cards.map(card => ({
    ...card,
    breakEven: calculateBreakEven(card)
  })).sort((a, b) => a.breakEven.netAnnualFee - b.breakEven.netAnnualFee);

  const totalNetFee = cardAnalysis.reduce((sum, card) => sum + card.breakEven.netAnnualFee, 0);
  const profitableCards = cardAnalysis.filter(card => card.breakEven.isBreakEven);
  const unprofitableCards = cardAnalysis.filter(card => !card.breakEven.isBreakEven);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-sm text-green-400 mb-1">Profitable Cards</p>
          <p className="text-3xl font-bold text-green-400">{profitableCards.length}</p>
          <p className="text-xs text-green-400/70 mt-1">Credits exceed annual fee</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-400 mb-1">Net Annual Cost</p>
          <p className="text-3xl font-bold text-red-400">${Math.abs(totalNetFee).toLocaleString()}</p>
          <p className="text-xs text-red-400/70 mt-1">Total fees minus credits</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Card Rankings</h3>
        <div className="space-y-3">
          {cardAnalysis.map((card, index) => (
            <div key={card.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                card.breakEven.valueRating === 'excellent' ? 'bg-green-500/20 text-green-400' :
                card.breakEven.valueRating === 'good' ? 'bg-blue-500/20 text-blue-400' :
                card.breakEven.valueRating === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{card.name}</p>
                <p className="text-xs text-slate-400">
                  ${card.breakEven.annualFee} fee • ${card.breakEven.totalCreditsValue} credits
                </p>
              </div>
              <div className={`text-right font-semibold ${
                card.breakEven.isBreakEven ? 'text-green-400' : 'text-red-400'
              }`}>
                {card.breakEven.isBreakEven ? '-' : '+'}${Math.abs(card.breakEven.netAnnualFee)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {profitableCards.length > 0 && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3">💚 Best Value Cards</h3>
          <div className="space-y-2">
            {profitableCards.map(card => (
              <div key={card.id} className="flex items-center justify-between">
                <span className="text-white">{card.name}</span>
                <span className="text-green-400 font-medium">
                  +${Math.abs(card.breakEven.netAnnualFee)} value
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
