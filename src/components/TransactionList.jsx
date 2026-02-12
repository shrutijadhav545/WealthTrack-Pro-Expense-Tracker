import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

export default function TransactionList({ transactions, onDelete }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col overflow-hidden max-h-175">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pune Ledger</p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">
          {transactions.length} Records
        </span>
      </div>

      {/* SCROLLABLE AREA: Capped height with custom scrollbar */}
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-125 lg:max-h-150">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 h-full text-center">
            <Calendar size={40} className="mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">No entries yet</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div 
              key={t.id} 
              className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                  t.type === 'income' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-tight">{t.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    {t.category} • {t.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <p className={`font-black text-sm md:text-base tracking-tight ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                </p>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}