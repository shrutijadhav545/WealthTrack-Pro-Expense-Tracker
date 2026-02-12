import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Wallet, LayoutDashboard, History, Settings, LogOut, Filter, PieChart as PieIcon, Menu, X, Target, Edit2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import ExpenseForm from './components/ExpenseForm';
import TransactionList from './components/TransactionList';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import CategoryPieChart from './components/CategoryPieChart';
import Auth from './components/Auth';

export default function App() {
  const componentRef = useRef(null);
  const [session, setSession] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Guard: Verify env variables are successfully loaded
  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL;

  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('savings_goal');
    return saved ? Number(saved) : 50000;
  });
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState(savingsGoal);

  useEffect(() => {
    if (!isConfigured) return; // Prevent crash if config is missing

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [isConfigured]);

  useEffect(() => {
    localStorage.setItem('savings_goal', savingsGoal.toString());
  }, [savingsGoal]);

  const fetchTransactions = useCallback(async () => {
    if (!session?.user?.id) return;
    setSyncing(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setTransactions(data || []);
    } finally {
      setSyncing(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (session && isMounted) await fetchTransactions();
    };
    loadData();
    return () => { isMounted = false; };
  }, [session, fetchTransactions]);

  const goalStats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const savings = income - expense;
    const progress = Math.min((savings / savingsGoal) * 100, 100);
    return { 
      currentSavings: savings > 0 ? savings : 0, 
      progress: savings > 0 ? progress : 0 
    };
  }, [transactions, savingsGoal]);

  const addTransaction = async (t) => {
    if (!session?.user?.id) return;
    const newEntry = { 
      title: t.title,
      amount: Number(t.amount),
      category: t.category,
      type: t.type,
      date: t.date,
      user_id: session.user.id 
    };
    const { data, error } = await supabase.from('transactions').insert([newEntry]).select();
    if (!error && data) {
      setTransactions([data[0], ...transactions]);
    } else if (error) {
      alert(`Sync Failed: ${error.message}`);
    }
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(transactions.filter(t => t.id !== id));
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `WealthTrack_Report`,
  });

  // Guard UI: Display if .env is not yet detected
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center">
        <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-rose-500/20">
          <Settings className="text-white w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-2xl font-black mb-2 uppercase tracking-widest">Missing .env Config</h2>
        <p className="text-slate-400 max-w-sm font-medium">Please ensure your .env file is in the root folder, keys start with VITE_, and you have restarted the server.</p>
      </div>
    );
  }

  if (authLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs">Connecting to Cloud...</div>;
  if (!session) return <Auth />;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-x-hidden">
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-4xl w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-black mb-2 tracking-tighter">Set Savings Goal</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Update target in ₹</p>
            <input 
              type="number" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600"
              value={tempGoal}
              onChange={(e) => setTempGoal(Number(e.target.value))}
            />
            <div className="flex gap-3">
              <button onClick={() => setIsGoalModalOpen(false)} className="flex-1 p-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={() => { setSavingsGoal(tempGoal); setIsGoalModalOpen(false); }} className="flex-1 p-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-all">
        {isSidebarOpen ? <X size={24}/> : <Menu size={24} />}
      </button>

      <aside className={`w-64 bg-slate-900 text-slate-400 flex flex-col p-6 fixed h-full z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center space-x-2.5 mb-10 pl-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">WealthTrack</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <NavItem icon={<History size={18}/>} label="Transactions" />
          <div className="mt-8 p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50 group relative">
            <button onClick={() => { setTempGoal(savingsGoal); setIsGoalModalOpen(true); }} className="absolute top-4 right-4 text-slate-500 hover:text-blue-400 transition-colors"><Edit2 size={12} /></button>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Savings Goal</span>
              <Target size={12} className="text-blue-500" />
            </div>
            <p className="text-white font-bold text-xs tracking-tight">₹{goalStats.currentSavings.toLocaleString('en-IN')} <span className="text-slate-500 font-medium">/ ₹{savingsGoal.toLocaleString('en-IN')}</span></p>
            <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-1000 ease-out" style={{ width: `${goalStats.progress}%` }} />
            </div>
          </div>
        </nav>

        <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center space-x-3 p-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-sm">
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </aside>

      <main ref={componentRef} className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 transition-all">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1 text-sm tracking-tight">Personal Finance Manager • {session.user.email}</p>
          </div>
          <button onClick={() => handlePrint()} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 shadow-xl transition-all">
            <FileText size={18} /> <span>Export PDF</span>
          </button>
        </header>

        {syncing && <div className="text-blue-600 font-bold mb-4 animate-pulse uppercase text-[10px] tracking-widest">Cloud Sync Active...</div>}

        <SummaryCards transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center space-x-2 tracking-tight">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full" /> <span>Analytics</span>
              </h3>
              <div className="h-64 md:h-80">
                <ExpenseChart transactions={transactions} />
              </div>
            </div>
            <div className="print:hidden"><ExpenseForm onAdd={addTransaction} /></div>
          </div>
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2 lg:sticky lg:top-8">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center space-x-2 tracking-tight">
                <PieIcon size={18} className="text-blue-600" /> <span>Category Split</span>
              </h3>
              <CategoryPieChart transactions={transactions} />
            </div>
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <button className={`flex items-center space-x-3 w-full p-3.5 rounded-xl font-bold transition-all text-sm ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}