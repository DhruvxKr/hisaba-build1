import { Category } from '../types';

interface ParsedExpense {
  amount?: number;
  merchant?: string;
  category?: Category;
  notes?: string;
}

export function parseNaturalLanguageInput(input: string): ParsedExpense {
  if (!input || !input.trim()) return {};

  const clean = input.trim();
  const result: ParsedExpense = {};

  // 1. Extract Amount (e.g. ₹450, 450rs, rs.450, 450 INR, or just numbers)
  const amountMatch = clean.match(/(?:₹|rs\.?|inr\s*)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rs|rupees|₹)?/i);
  if (amountMatch && amountMatch[1]) {
    const rawNum = amountMatch[1].replace(/,/g, '');
    const parsedNum = parseFloat(rawNum);
    if (!isNaN(parsedNum) && parsedNum > 0) {
      result.amount = parsedNum;
    }
  }

  // 2. Identify Category keywords
  const lower = clean.toLowerCase();
  
  if (lower.includes('coffee') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('food') || lower.includes('restaurant') || lower.includes('zomato') || lower.includes('swiggy') || lower.includes('cafe') || lower.includes('pizza') || lower.includes('burger') || lower.includes('dining')) {
    result.category = 'Food';
  } else if (lower.includes('uber') || lower.includes('cab') || lower.includes('metro') || lower.includes('auto') || lower.includes('petrol') || lower.includes('fuel') || lower.includes('ola') || lower.includes('rapido') || lower.includes('transport') || lower.includes('bus')) {
    result.category = 'Transport';
  } else if (lower.includes('amazon') || lower.includes('clothes') || lower.includes('shopping') || lower.includes('shoes') || lower.includes('zepto') || lower.includes('flipkart') || lower.includes('myntra')) {
    result.category = 'Shopping';
  } else if (lower.includes('movie') || lower.includes('film') || lower.includes('concert') || lower.includes('show') || lower.includes('gaming') || lower.includes('lounge') || lower.includes('bookmyshow')) {
    result.category = 'Entertainment';
  } else if (lower.includes('electricity') || lower.includes('bill') || lower.includes('wifi') || lower.includes('internet') || lower.includes('water') || lower.includes('rent')) {
    result.category = 'Bills';
  } else if (lower.includes('doctor') || lower.includes('medicine') || lower.includes('gym') || lower.includes('pharmacy') || lower.includes('health') || lower.includes('hospital')) {
    result.category = 'Health';
  } else if (lower.includes('flight') || lower.includes('hotel') || lower.includes('train') || lower.includes('travel') || lower.includes('trip') || lower.includes('stay')) {
    result.category = 'Travel';
  } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('apple') || lower.includes('subscription') || lower.includes('youtube')) {
    result.category = 'Subscriptions';
  } else if (lower.includes('course') || lower.includes('book') || lower.includes('udemy') || lower.includes('tuition')) {
    result.category = 'Education';
  }

  // 3. Extract Merchant name or text removing amount keywords
  let merchantText = clean
    .replace(/(?:₹|rs\.?|inr\s*)?\s*\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|rupees|₹)?/gi, '')
    .replace(/\b(for|at|on|today|yesterday|paid)\b/gi, '')
    .trim();

  if (merchantText.length > 0) {
    // Capitalize first letter
    result.merchant = merchantText.charAt(0).toUpperCase() + merchantText.slice(1);
  }

  result.notes = `Added via Smart Assistant: "${clean}"`;

  return result;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
