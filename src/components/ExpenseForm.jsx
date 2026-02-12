import { useState } from 'react';
import { PlusCircle, ShoppingBag, Coffee, Home, Car, Utensils, Zap } from 'lucide-react';

const CATEGORIES = [
  { name: 'Food', icon: Utensils },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Rent', icon: Home },
  { name: 'Transport', icon: Car },
  { name: 'Utilities', icon: Zap },
  { name: 'Entertainment', icon: Coffee },
];

export default function ExpenseForm({ onAdd }) {
  const [formData, setFormData] = useState({ 
    title: '', 
    amount: '', 
    category: 'Food', 
    type: 'expense' 
  });

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const newType = selectedCategory === 'Income' ? 'income' : 'expense';
    
    setFormData({
      ...formData,
      category: selectedCategory,
      type: newType
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    onAdd({ 
      ...formData, 
      id: Date.now(), 
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) 
    });

    setFormData({ title: '', amount: '', category: 'Food', type: 'expense' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
        <div className="w-2 h-6 bg-blue-600 rounded-full" />
        <span>Add New Transaction</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter ml-1">Title</label>
          <input 
            type="text" 
            placeholder="e.g. Salary or Coffee" 
            className="p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50/50"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter ml-1">Amount</label>
          <input 
            type="number" 
            placeholder="0.00" 
            className="p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50/50"
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter ml-1">Category</label>
          <select 
            className="p-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            value={formData.category} 
            onChange={handleCategoryChange}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
            <option value="Income">Income / Salary</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button 
            type="submit" 
            // Fixed: Changed h-[54px] to h-13.5 per canonical suggestion
            className="bg-blue-600 text-white p-3.5 h-13.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>
    </form>
  );
}