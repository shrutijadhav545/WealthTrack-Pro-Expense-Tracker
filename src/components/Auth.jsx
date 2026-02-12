import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Wallet, LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else if (isSignUp) {
      alert('Verification email sent! Please check your inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-4xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4">
            <Wallet className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">WealthTrack Pro</h2>
          <p className="text-slate-500 font-bold text-sm uppercase mt-2 tracking-widest">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              className="p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50/50 transition-all font-semibold"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              className="p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-slate-50/50 transition-all font-semibold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            {isSignUp ? <UserPlus size={20}/> : <LogIn size={20}/>}
            <span>{loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}