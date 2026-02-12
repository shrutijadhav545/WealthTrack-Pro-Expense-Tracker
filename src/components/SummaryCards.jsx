import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function SummaryCards({ transactions }) {
  // 1. Calculate Total Income
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);
  
  // 2. Calculate Total Expenses
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // 3. Final Math: Total Income - Total Expenses
  const currentBalance = totalIncome - totalExpenses;

  const cards = [
    { 
      title: 'Current Balance', 
      amount: currentBalance, 
      icon: Wallet, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Total Income', 
      amount: totalIncome, 
      icon: ArrowUpCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      title: 'Total Expenses', 
      amount: totalExpenses, 
      icon: ArrowDownCircle, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5 transition-all hover:shadow-md">
          <div className={`p-4 rounded-2xl ${card.bg}`}>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
            <p className={`text-3xl font-black tracking-tight ${
              card.title === 'Current Balance' && card.amount < 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              ₹{card.amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}