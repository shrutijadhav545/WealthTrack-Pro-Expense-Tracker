import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpenseChart({ transactions }) {
  // Logic to format data for the chart
  const data = transactions.slice(-7).map(t => ({
    name: t.title.substring(0, 5),
    amount: Number(t.amount)
  })).reverse();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 h-80">
      <h3 className="font-bold text-slate-800 mb-4">Spending Trend (Last 7 Items)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}