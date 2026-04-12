import React, { useState, useEffect } from 'react';
import { 
  Bed, 
  DoorOpen, 
  DoorClosed, 
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

const sparklineData = [10, 25, 15, 30, 20, 45, 35];

function Sparkline({ color }) {
  return (
    <svg className="w-16 h-6 ml-auto mt-2" viewBox="0 0 60 20" preserveAspectRatio="none">
      <polyline 
        points="0,15 10,5 20,12 30,2 40,8 50,0 60,10" 
        fill="none" 
        stroke={color} 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KpiCard({ title, value, icon: Icon, trend, percentage, topBorderColor, iconColor, bgColor, sparklineColor }) {
  const isPositive = trend === 'up';
  
  return (
    <div className={cn(
      "bg-[var(--bg-card)] rounded-2xl p-5 md:p-6 shadow-sm border border-[var(--border)] border-t-[3px] border-t-transparent flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md group",
      topBorderColor
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-105 duration-300", bgColor, iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
          isPositive ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400' : 'text-rose-700 bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400'
        )}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {percentage}%
        </div>
      </div>
      <div>
        <p className="text-[var(--text-muted)] text-sm font-medium">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-none mt-1.5">{value}</h3>
          <Sparkline color={sparklineColor} />
        </div>
      </div>
    </div>
  );
}

const CircularProgress = ({ progress }) => {
  const [offset, setOffset] = useState(251); 
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (progress / 100) * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress, circumference]);

  return (
    <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-emerald-500 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{progress}</span>
        <span className="text-xs font-medium text-[var(--text-muted)] -mt-0.5">/ 100</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  const totalRooms = 150;
  const occupiedRooms = 112;
  const availableRooms = totalRooms - occupiedRooms;
  const totalRevenue = "$12,450";

  const weekData = [
    { name: 'Mon', revenue: 4000, projected: 4200 },
    { name: 'Tue', revenue: 3000, projected: 3100 },
    { name: 'Wed', revenue: 2000, projected: 1900 },
    { name: 'Thu', revenue: 3000, projected: 3000 },
    { name: 'Fri', revenue: 4500, projected: 4500 },
    { name: 'Sat', revenue: 6000, projected: 6200 },
    { name: 'Sun', revenue: 5000, projected: 5000 },
  ];
  const monthData = Object.assign([], weekData).map(d => ({ ...d, revenue: d.revenue * 3.5, projected: d.projected * 3.5 }));
  const yearData = Object.assign([], monthData).map(d => ({ ...d, name: d.name + ' (Q)', revenue: d.revenue * 12, projected: d.projected * 12 }));

  const [activeChartData, setActiveChartData] = useState(weekData);
  const [chartPeriod, setChartPeriod] = useState('This Week');

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    setChartPeriod(val);
    if(val === 'This Week') setActiveChartData(weekData);
    if(val === 'This Month') setActiveChartData(monthData);
    if(val === 'This Year') setActiveChartData(yearData);
  };

  const initialBookings = [
    { id: '1', guest: 'Karim Alaoui', room: '204', type: 'Suite', checkIn: 'Apr 11', checkOut: 'Apr 14', status: 'Checked-in', amount: '$420', actions: 'View / Edit' },
    { id: '2', guest: 'Sofia Laurent', room: '118', type: 'Double', checkIn: 'Apr 11', checkOut: 'Apr 13', status: 'Pending', amount: '$180', actions: 'View / Edit' },
    { id: '3', guest: 'Mehdi Raissouni', room: '312', type: 'Single', checkIn: 'Apr 11', checkOut: 'Apr 15', status: 'Checked-in', amount: '$260', actions: 'View / Edit' },
    { id: '4', guest: 'Anna Fischer', room: '401', type: 'Suite', checkIn: 'Apr 12', checkOut: 'Apr 16', status: 'Confirmed', amount: '$680', actions: 'View / Edit' },
    { id: '5', guest: 'Omar Tazi', room: '109', type: 'Double', checkIn: 'Apr 10', checkOut: 'Apr 11', status: 'Checked-out', amount: '$190', actions: 'View' },
    { id: '6', guest: 'Fatima El Idrissi', room: '205', type: 'Family', checkIn: 'Apr 11', checkOut: 'Apr 18', status: 'Pending', amount: '$840', actions: 'View / Edit' },
  ];

  const [bookings, setBookings] = useState(initialBookings);
  const [sortConfig, setSortConfig] = useState(null);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...bookings].sort((a, b) => {
      let aVal = a[key], bVal = b[key];
      if(key === 'amount') {
        aVal = parseFloat(a[key].replace('$', ''));
        bVal = parseFloat(b[key].replace('$', ''));
      }
      if (aVal < bVal) return direction === 'ascending' ? -1 : 1;
      if (aVal > bVal) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setBookings(sorted);
  };

  const getSortIcon = (name) => {
    if (!sortConfig || sortConfig.key !== name) return <span className="opacity-0 group-hover:opacity-50 ml-1 text-[10px]">▼</span>;
    return <span className="ml-1 text-[10px] text-emerald-500">{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
  };

  const generateRooms = () => {
    const statuses = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    return Array.from({length: 24}).map((_, i) => {
      const floor = Math.floor(i / 8) + 1;
      const roomNum = `${floor}${String((i % 8) + 1).padStart(2, '0')}`;
      let status = statuses[Math.floor(Math.random() * statuses.length)];
      if (roomNum === '204') status = 'Occupied';
      return { id: roomNum, status, label: roomNum };
    });
  };
  const [floorRooms] = useState(generateRooms());

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in duration-700 h-full pb-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 font-medium">Welcome back. Press <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-medium shadow-sm ml-1">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-medium shadow-sm">K</kbd> for Quick Actions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <KpiCard 
          title="Total Rooms" 
          value={totalRooms} 
          icon={Bed} 
          trend="up" 
          percentage="2.4" 
          topBorderColor="border-t-emerald-500"
          iconColor="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-100 dark:bg-emerald-500/20"
          sparklineColor="#10b981"
        />
        <KpiCard 
          title="Available" 
          value={availableRooms} 
          icon={DoorOpen} 
          trend="down" 
          percentage="1.2" 
          topBorderColor="border-t-blue-500"
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-500/20"
          sparklineColor="#3b82f6"
        />
        <KpiCard 
          title="Occupied" 
          value={occupiedRooms} 
          icon={DoorClosed} 
          trend="up" 
          percentage="5.8" 
          topBorderColor="border-t-amber-500"
          iconColor="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-100 dark:bg-amber-500/20"
          sparklineColor="#f59e0b"
        />
        <KpiCard 
          title="Revenue" 
          value={totalRevenue} 
          icon={Wallet} 
          trend="up" 
          percentage="12.5" 
          topBorderColor="border-t-purple-500"
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-500/20"
          sparklineColor="#a855f7"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm xl:col-span-2 flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Revenue & Projections</h2>
              <p className="text-xs font-medium text-[var(--text-muted)] mt-1">AI-driven predictive model vs actuals.</p>
            </div>
            <select 
              value={chartPeriod}
              onChange={handlePeriodChange}
              className="bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer w-full sm:w-auto"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[280px] md:h-[320px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500}} dx={-15} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', fontSize: '13px', fontWeight: '500' }}
                  cursor={{stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" name="Projected" dataKey="projected" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                <Area type="monotone" name="Actual" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* AI Insights Panel */}
          <div className="bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 animate-gradient-shift rounded-2xl p-5 md:p-6 shadow-lg border border-slate-700/50 flex flex-col min-h-0 overflow-hidden relative">
            <div className="absolute -top-4 -right-4 p-6 opacity-20 pointer-events-none">
              <Sparkles className="w-32 h-32 text-emerald-400 rotate-12" />
            </div>
            <div className="flex items-center gap-3 mb-5 relative z-10 shrink-0">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold text-white tracking-tight">AI Insights</h2>
            </div>
            
            <div className="space-y-3 relative z-10 overflow-y-auto no-scrollbar pb-2 flex-1">
              {[
                { icon: TrendingUp, iconColor: "text-emerald-400", title: "High Demand This Weekend", desc: "Consider raising suite prices by 15%. Local events detected." },
                { icon: AlertCircle, iconColor: "text-amber-400", title: "Room 102 Underperforming", desc: "Occupancy is 30% below avg. Add a promotion." },
                { icon: Clock, iconColor: "text-blue-400", title: "Weekend Checkout Rush", desc: "Prepare 8 rooms for 14:00 turnover." }
              ].map((insight, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm group cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden">
                  <div className="flex gap-3">
                    <insight.icon className={cn("w-4 h-4 mt-0.5 shrink-0", insight.iconColor)} />
                    <div>
                      <h4 className="font-medium text-white text-sm">{insight.title}</h4>
                      <p className="text-slate-300/80 text-xs mt-1 font-normal leading-relaxed max-w-[85%]">{insight.desc}</p>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-1.5 rounded-md">
                      Take Action <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Occupancy Score */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between items-center text-center">
             <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight w-full text-left mb-4">Occupancy Score</h2>
             <CircularProgress progress={92} />
             <div className="w-full flex justify-between mt-6 px-2 border-t border-[var(--border)] pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Rooms</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">18</span>
                </div>
                <div className="w-px bg-[var(--border)] h-8"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">RevPAR</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">$87</span>
                </div>
                <div className="w-px bg-[var(--border)] h-8"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">ADR</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">$112</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Room Status Floor Map */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm p-5 md:p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Room Status — Floor View</h2>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
             {[{label:'Available', color:'bg-emerald-500'}, {label:'Occupied', color:'bg-blue-500'}, {label:'Cleaning', color:'bg-amber-500'}, {label:'Maintenance', color:'bg-rose-500'}].map(leg => (
               <div key={leg.label} className="flex items-center gap-1.5">
                 <div className={cn("w-2.5 h-2.5 rounded-full", leg.color)}></div>
                 <span className="text-xs font-medium text-[var(--text-muted)]">{leg.label}</span>
               </div>
             ))}
          </div>
        </div>
        
        <div className="grid gap-5 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
          {[1,2,3].map(floor => (
            <div key={floor} className="flex items-center gap-4 min-w-max">
              <span className="text-sm font-medium text-[var(--text-muted)] w-14 shrink-0">Floor {floor}</span>
              <div className="flex gap-2.5">
                {floorRooms.filter(r => r.id.startsWith(String(floor))).map(room => (
                  <div 
                    key={room.id}
                    title={room.id === '204' ? "Room 204 — Karim Alaoui — Checkout Apr 14" : `Room ${room.id} — ${room.status}`}
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-xs font-semibold text-white shadow-sm cursor-pointer transition-transform hover:scale-105",
                      room.status === 'Available' ? "bg-emerald-500" :
                      room.status === 'Occupied' ? "bg-blue-500" :
                      room.status === 'Cleaning' ? "bg-amber-500 animate-pulse" :
                      "bg-rose-500"
                    )}
                  >
                    {room.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Recent Bookings</h2>
          <button 
            onClick={() => navigate('/bookings')}
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
          >
            View All &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-main)] border-b border-[var(--border)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider font-semibold">
                {['guest', 'room', 'type', 'checkIn', 'checkOut', 'status', 'amount', 'actions'].map((key) => (
                  <th key={key} onClick={() => requestSort(key)} className="py-3.5 px-6 group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors select-none">
                    <div className="flex items-center">
                      {key.replace(/([A-Z])/g, ' $1').trim()} {getSortIcon(key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan="8" className="py-12 text-center text-sm text-[var(--text-muted)]">No bookings yet. Start by creating one.</td></tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[var(--border)] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors last:border-0 group">
                  <td className="py-4 px-6 text-sm font-medium text-[var(--text-primary)]">{booking.guest}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">{booking.room}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">{booking.type}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">{booking.checkIn}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">{booking.checkOut}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium border flex w-max items-center shadow-sm",
                      booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                      booking.status === 'Checked-in' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                      booking.status === 'Checked-out' ? 'bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' :
                      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-[var(--text-primary)]">{booking.amount}</td>
                  <td className="py-4 px-6 text-sm font-medium text-emerald-600 dark:text-emerald-400 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">{booking.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
