import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Category, PaymentMethod } from '../types';
import { CATEGORIES_META } from '../data/categories';
import { parseNaturalLanguageInput } from '../utils/nlpParser';

export const AddExpenseScreen: React.FC = () => {
  const { addExpense, setActiveTab } = useExpenses();

  const [amountStr, setAmountStr] = useState<string>('450');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Food');
  const [merchant, setMerchant] = useState<string>('Dining');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [nlpInput, setNlpInput] = useState<string>('');
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);

  // Quick preset loader
  const handleQuickPreset = (presetAmount: number, presetMerchant: string, cat: Category) => {
    setAmountStr(presetAmount.toString());
    setMerchant(presetMerchant);
    setSelectedCategory(cat);
  };

  // Process natural language input
  const handleNlpChange = (val: string) => {
    setNlpInput(val);
    if (!val.trim()) return;
    const parsed = parseNaturalLanguageInput(val);
    if (parsed.amount) {
      setAmountStr(parsed.amount.toString());
    }
    if (parsed.merchant) {
      setMerchant(parsed.merchant);
    }
    if (parsed.category) {
      setSelectedCategory(parsed.category);
    }
  };

  // Keyboard number keypad support
  const handleKeypadPress = (key: string) => {
    if (key === 'DEL') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (key === 'CLR') {
      setAmountStr('0');
    } else {
      setAmountStr((prev) => (prev === '0' ? key : prev + key));
    }
  };

  const handleSave = () => {
    const numAmount = parseFloat(amountStr) || 0;
    if (numAmount <= 0) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    addExpense({
      amount: numAmount,
      merchant: merchant.trim() || 'General Expense',
      category: selectedCategory,
      date: now.toISOString().split('T')[0],
      time: timeStr,
      paymentMethod,
      notes: notes || (nlpInput ? `Smart input: "${nlpInput}"` : undefined),
    });

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      setActiveTab('home');
    }, 1200);
  };

  return (
    <div className="flex flex-col relative w-full pt-4 pb-36 min-h-screen">
      {/* Amount Display Section */}
      <div className="flex flex-col items-center justify-center py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10" />
        <span className="text-body-sm text-primary-fixed-dim uppercase tracking-widest font-label-caps mb-3">
          Entering Expense
        </span>

        {/* Currency & Amount display */}
        <div className="flex items-center justify-center cursor-pointer group">
          <span className="text-headline-lg text-primary opacity-70 mr-1 font-bold">₹</span>
          <span className="text-[64px] leading-none font-bold text-on-surface tracking-tighter">
            {amountStr}
          </span>
          <span className="w-[3px] h-[52px] bg-primary ml-1 rounded-full animate-pulse shadow-[0_0_12px_#d0bcff]" />
        </div>

        {/* On-screen Numeric Keypad Toggle */}
        <div className="grid grid-cols-4 gap-2 mt-6 max-w-xs w-full px-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00', 'DEL'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num)}
              className="py-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-highest text-on-surface font-semibold text-body-lg active:scale-95 transition-all border border-white/5"
            >
              {num === 'DEL' ? '⌫' : num}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Categories Bento Grid */}
      <div className="flex flex-col gap-stack-md mt-2">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-label-caps text-on-surface-variant uppercase tracking-widest">
            Smart Categories
          </h2>
          {selectedCategory && (
            <span className="text-body-sm text-primary font-semibold">
              Selected: {selectedCategory}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Dining */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Food');
              if (merchant === 'Dining' || !merchant) setMerchant('Dining');
            }}
            className={`relative p-5 rounded-2xl flex flex-col items-start gap-4 active:scale-95 transition-all overflow-hidden border shadow-inner text-left ${
              selectedCategory === 'Food'
                ? 'bg-primary-container border-white/20 shadow-[0_0_24px_rgba(208,188,255,0.2)]'
                : 'bg-surface-container border-white/5'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedCategory === 'Food'
                  ? 'bg-background/30 text-on-primary-container'
                  : 'bg-secondary-container/10 text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">restaurant</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className={`text-headline-md font-semibold ${
                  selectedCategory === 'Food' ? 'text-on-primary-container' : 'text-on-surface'
                }`}
              >
                Dining
              </span>
              <span
                className={`text-body-sm mt-1 ${
                  selectedCategory === 'Food'
                    ? 'text-on-primary-container/80'
                    : 'text-on-surface-variant'
                }`}
              >
                Food, Drinks, Zomato
              </span>
            </div>
          </button>

          {/* Transport */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Transport');
              if (merchant === 'Dining' || !merchant) setMerchant('Transport');
            }}
            className={`relative p-5 rounded-2xl flex flex-col items-start gap-4 active:scale-95 transition-all overflow-hidden border shadow-inner text-left ${
              selectedCategory === 'Transport'
                ? 'bg-primary-container border-white/20 shadow-[0_0_24px_rgba(208,188,255,0.2)]'
                : 'bg-surface-container border-white/5'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedCategory === 'Transport'
                  ? 'bg-background/30 text-on-primary-container'
                  : 'bg-primary-container/20 text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">directions_car</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className={`text-headline-md font-semibold ${
                  selectedCategory === 'Transport' ? 'text-on-primary-container' : 'text-on-surface'
                }`}
              >
                Transport
              </span>
              <span
                className={`text-body-sm mt-1 ${
                  selectedCategory === 'Transport'
                    ? 'text-on-primary-container/80'
                    : 'text-on-surface-variant'
                }`}
              >
                Uber, Metro, Fuel
              </span>
            </div>
          </button>

          {/* Groceries / Shopping */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Shopping');
              if (merchant === 'Dining' || !merchant) setMerchant('Groceries');
            }}
            className={`relative p-5 rounded-2xl flex flex-col items-start gap-4 active:scale-95 transition-all overflow-hidden border shadow-inner text-left ${
              selectedCategory === 'Shopping'
                ? 'bg-primary-container border-white/20 shadow-[0_0_24px_rgba(208,188,255,0.2)]'
                : 'bg-surface-container border-white/5'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedCategory === 'Shopping'
                  ? 'bg-background/30 text-on-primary-container'
                  : 'bg-tertiary-container/20 text-tertiary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className={`text-headline-md font-semibold ${
                  selectedCategory === 'Shopping' ? 'text-on-primary-container' : 'text-on-surface'
                }`}
              >
                Shopping
              </span>
              <span
                className={`text-body-sm mt-1 ${
                  selectedCategory === 'Shopping'
                    ? 'text-on-primary-container/80'
                    : 'text-on-surface-variant'
                }`}
              >
                Blinkit, Zepto, Amazon
              </span>
            </div>
          </button>

          {/* More Categories Button */}
          <button
            type="button"
            onClick={() => setShowMoreCategories(true)}
            className="relative bg-surface-container p-5 rounded-2xl flex flex-col items-start gap-4 active:scale-95 transition-all overflow-hidden border border-white/5 shadow-inner text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center text-on-surface group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">more_horiz</span>
            </div>
            <div className="flex flex-col items-start justify-end h-full">
              <span className="text-headline-md font-semibold text-on-surface">More</span>
              <span className="text-body-sm text-on-surface-variant mt-1">
                Bills, Travel & More
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Add Presets */}
      <div className="flex flex-col gap-stack-sm mt-6">
        <h2 className="text-label-caps text-on-surface-variant uppercase tracking-widest px-2">
          Quick Add
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x -mx-margin-mobile px-margin-mobile hide-scrollbar">
          <button
            type="button"
            onClick={() => handleQuickPreset(150, 'Coffee', 'Food')}
            className="snap-start shrink-0 bg-surface-container-high rounded-full pl-2 pr-5 py-2 flex items-center gap-3 text-on-surface active:bg-surface-variant transition-colors border border-white/5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">local_cafe</span>
            </div>
            <span className="text-body-sm font-semibold">Coffee ₹150</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset(800, 'Movies & IMAX', 'Entertainment')}
            className="snap-start shrink-0 bg-surface-container-high rounded-full pl-2 pr-5 py-2 flex items-center gap-3 text-on-surface active:bg-surface-variant transition-colors border border-white/5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">movie</span>
            </div>
            <span className="text-body-sm font-semibold">Movies ₹800</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset(450, 'Lunch Special', 'Food')}
            className="snap-start shrink-0 bg-surface-container-high rounded-full pl-2 pr-5 py-2 flex items-center gap-3 text-on-surface active:bg-surface-variant transition-colors border border-white/5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
            </div>
            <span className="text-body-sm font-semibold">Lunch ₹450</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickPreset(500, 'Fuel Station', 'Transport')}
            className="snap-start shrink-0 bg-surface-container-high rounded-full pl-2 pr-5 py-2 flex items-center gap-3 text-on-surface active:bg-surface-variant transition-colors border border-white/5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
            </div>
            <span className="text-body-sm font-semibold">Fuel ₹500</span>
          </button>
        </div>
      </div>

      {/* Additional Details (Merchant & Payment Method) */}
      <div className="bg-surface-container rounded-2xl p-4 mt-6 border border-white/5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
            edit_note
          </span>
          <span className="text-label-caps text-on-surface-variant uppercase">
            Expense Details
          </span>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Merchant or Title (e.g. Zomato)"
            className="flex-1 bg-surface-container-low text-on-surface rounded-xl px-4 py-2.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary/50 border border-white/5"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="bg-surface-container-low text-on-surface rounded-xl px-3 py-2.5 text-body-sm focus:outline-none border border-white/5 cursor-pointer"
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="NetBanking">NetBanking</option>
          </select>
        </div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 inset-x-0 bg-[#131313]/95 backdrop-blur-2xl border-t border-white/10 z-50 px-margin-mobile pb-safe pt-4 flex flex-col gap-3">
        {/* Natural Language Input */}
        <div className="relative bg-surface-container-lowest rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex items-center transition-colors focus-within:border-primary/50 focus-within:bg-surface-container">
          <div className="pl-4 pr-2 py-3 text-primary">
            <span className="material-symbols-outlined text-[20px] animate-pulse">auto_awesome</span>
          </div>
          <input
            type="text"
            value={nlpInput}
            onChange={(e) => handleNlpChange(e.target.value)}
            placeholder="e.g. Dinner at Taj for ₹450 today"
            className="w-full bg-transparent text-on-surface py-3 pr-4 text-body-sm focus:outline-none placeholder:text-on-surface-variant/50"
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSavedSuccess}
          className={`w-full py-4 rounded-xl font-headline-md text-headline-md text-on-primary relative overflow-hidden group active:scale-[0.98] transition-all mb-2 flex items-center justify-center gap-2 ${
            isSavedSuccess
              ? 'bg-secondary text-on-secondary shadow-[0_0_24px_rgba(78,222,163,0.5)]'
              : 'bg-primary shadow-[0_0_20px_rgba(208,188,255,0.3)] hover:bg-primary-fixed-dim'
          }`}
        >
          {isSavedSuccess ? (
            <>
              Saved <span className="material-symbols-outlined text-[22px]">done_all</span>
            </>
          ) : (
            <>
              Save Expense <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </>
          )}
        </button>
      </div>

      {/* More Categories Bottom Sheet */}
      {showMoreCategories && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="w-full max-w-lg bg-surface-container rounded-t-[32px] p-6 border-t border-white/10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-headline-md text-on-surface font-semibold">Select Category</h3>
              <button
                type="button"
                onClick={() => setShowMoreCategories(false)}
                className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {Object.values(CATEGORIES_META).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowMoreCategories(false);
                  }}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-surface-container-low border-white/5 text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ color: cat.color }}>
                    {cat.materialIcon}
                  </span>
                  <span className="text-body-sm font-semibold truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
