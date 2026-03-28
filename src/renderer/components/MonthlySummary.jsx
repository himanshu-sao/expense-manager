import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CATEGORIES, getCategoryById, formatCurrency, filterExpensesByMonth } from '../utils/expenseUtils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlySummary = ({ expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthExpenses = filterExpensesByMonth(expenses, selectedMonth, selectedYear);

  const categoryData = CATEGORIES.map(cat => {
    const catExpenses = monthExpenses.filter(exp => exp.category === cat.id);
    const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat.name,
      icon: cat.icon,
      value: total,
      color: cat.color,
      count: catExpenses.length
    };
  }).filter(item => item.value > 0);

  const dailyData = monthExpenses.reduce((acc, exp) => {
    const day = new Date(exp.date).getDate();
    const existing = acc.find(d => d.day === day);
    if (existing) {
      existing.amount += exp.amount;
    } else {
      acc.push({ day, amount: exp.amount });
    }
    return acc;
  }, []).sort((a, b) => a.day - b.day);

  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{data.icon} {data.name}</p>
          <p className="text-indigo-400 font-semibold">{formatCurrency(data.value)}</p>
          <p className="text-slate-400 text-sm">{data.count} transaction{data.count !== 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {MONTHS.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {[2023, 2024, 2025, 2026].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
        {categoryData.length > 0 ? (
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {categoryData.slice(0, 5).map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-300 text-sm">{cat.icon} {cat.name}</span>
                  </div>
                  <span className="text-white font-medium text-sm">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No expenses for this month</p>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Spending</h3>
        {dailyData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No expenses for this month</p>
        )}
      </div>
    </div>
  );
};

export default MonthlySummary;
