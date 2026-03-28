import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CARD_TEMPLATES, CARD_ISSUERS, REWARD_TYPES, MONTHS, CARD_DATA_URL } from '../utils/cardUtils';

const AddCardForm = ({ onAdd, onRefreshData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    annualFee: 0,
    renewalMonth: 0,
    rewardType: 'membership_rewards',
    credits: [],
    benefits: [],
    earnRates: [],
    currentPoints: 0,
    monthlySpend: {},
    notes: ''
  });

  const handleRefreshData = async () => {
    setRefreshing(true);
    setRefreshMessage('');
    try {
      const response = await fetch(CARD_DATA_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      if (data.cards && data.version) {
        if (onRefreshData) {
          onRefreshData(data.cards);
        }
        setRefreshMessage(`✓ Loaded ${data.cards.length} cards (v${data.version})`);
      } else {
        setRefreshMessage('✗ Invalid data format');
      }
    } catch (error) {
      setRefreshMessage('✗ Failed to fetch card data. Using local data.');
    }
    setRefreshing(false);
    setTimeout(() => setRefreshMessage(''), 3000);
  };

  const handleTemplateSelect = (templateId) => {
    const template = CARD_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        name: template.name,
        issuer: template.issuer,
        annualFee: template.annualFee,
        renewalMonth: template.renewalMonth,
        rewardType: template.rewardType,
        credits: [...template.credits],
        benefits: [...template.benefits],
        earnRates: [...template.earnRates],
        currentPoints: 0,
        monthlySpend: {},
        notes: ''
      });
      setSelectedTemplate(templateId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const card = {
      id: uuidv4(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    onAdd(card);
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      annualFee: 0,
      renewalMonth: 0,
      rewardType: 'membership_rewards',
      credits: [],
      benefits: [],
      earnRates: [],
      currentPoints: 0,
      monthlySpend: {},
      notes: ''
    });
    setSelectedTemplate('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCredit = () => {
    setFormData(prev => ({
      ...prev,
      credits: [...prev.credits, { name: '', amount: 0, frequency: 'annual', description: '' }]
    }));
  };

  const updateCredit = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      credits: prev.credits.map((c, i) => i === index ? { ...c, [field]: value } : c)
    }));
  };

  const removeCredit = (index) => {
    setFormData(prev => ({
      ...prev,
      credits: prev.credits.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Credit Card
        </button>
        <button
          onClick={handleRefreshData}
          disabled={refreshing}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600"
        >
          <svg 
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : '🔄 Refresh Card Data'}
        </button>
        {refreshMessage && (
          <p className={`text-sm text-center ${refreshMessage.includes('✓') ? 'text-green-400' : 'text-yellow-400'}`}>
            {refreshMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4 shadow-lg border border-slate-700 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2 sticky top-0 bg-slate-800 pb-2">
        <h3 className="text-lg font-semibold text-white">Add Credit Card</h3>
        <button
          type="button"
          onClick={() => { setIsOpen(false); resetForm(); }}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Start with a template (optional)</label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select a card template...</option>
          {CARD_TEMPLATES.map(template => (
            <option key={template.id} value={template.id}>{template.name} (${template.annualFee}/yr)</option>
          ))}
        </select>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Card Details</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Card Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Issuer</label>
            <select
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CARD_ISSUERS.map(issuer => (
                <option key={issuer.id} value={issuer.id}>{issuer.logo} {issuer.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Annual Fee</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                name="annualFee"
                value={formData.annualFee}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Renewal Month</label>
            <select
              name="renewalMonth"
              value={formData.renewalMonth}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Reward Type</label>
            <select
              name="rewardType"
              value={formData.rewardType}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {REWARD_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Current Points Balance</label>
            <input
              type="number"
              name="currentPoints"
              value={formData.currentPoints}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-slate-400">Credits & Benefits</h4>
          <button
            type="button"
            onClick={addCredit}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            + Add Credit
          </button>
        </div>
        
        {formData.credits.map((credit, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-3 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={credit.name}
                onChange={(e) => updateCredit(index, 'name', e.target.value)}
                placeholder="Credit name"
                className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={credit.amount}
                onChange={(e) => updateCredit(index, 'amount', parseInt(e.target.value) || 0)}
                placeholder="$"
                className="w-20 bg-slate-600 border border-slate-500 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => removeCredit(index)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={credit.description}
              onChange={(e) => updateCredit(index, 'description', e.target.value)}
              placeholder="Description"
              className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          placeholder="Any additional notes..."
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
      >
        Add Card
      </button>
    </form>
  );
};

export default AddCardForm;
