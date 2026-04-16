import React, { useState, useEffect, useMemo } from 'react';
import api from '../lib/axios';
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

function formatShortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMoney(amount) {
  const n = parseFloat(String(amount ?? ''), 10);
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [apiRooms, setApiRooms] = useState([]);
  const [apiBookings, setApiBookings] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

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
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setOverviewLoading(true);
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          api.get('/api/rooms?per_page=500'),
          api.get('/api/bookings?per_page=500'),
        ]);
        if (cancelled) return;
        setApiRooms(roomsRes.data?.data ?? []);
        setApiBookings(bookingsRes.data?.data ?? []);
      } catch {
        if (!cancelled) {
          setApiRooms([]);
          setApiBookings([]);
        }
      } finally {
        if (!cancelled) setOverviewLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalRooms = apiRooms.length;
  const availableRooms = apiRooms.filter((r) => r.status === 'Available').length;
  const occupiedRooms = apiRooms.filter((r) => r.status === 'Occupied').length;
  const confirmedRevenue = apiBookings
    .filter((b) => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (parseFloat(String(b.total_amount ?? '0'), 10) || 0), 0);
  const totalRevenue = formatMoney(confirmedRevenue);

  const floorChunks = useMemo(() => {
    const list = [...apiRooms];
    const n = list.length;
    if (n === 0) return [[], [], []];
    const size = Math.ceil(n / 3) || 1;
    return [0, 1, 2].map((i) => list.slice(i * size, (i + 1) * size));
  }, [apiRooms]);

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    setChartPeriod(val);
    if(val === 'This Week') setActiveChartData(weekData);
    if(val === 'This Month') setActiveChartData(monthData);
    if(val === 'This Year') setActiveChartData(yearData);
  };

  const bookingRows = useMemo(() => {
    return apiBookings.slice(0, 8).map((b) => ({
      id: String(b.id),
      guest: b.guest ? `${b.guest.first_name ?? ''} ${b.guest.last_name ?? ''}`.trim() || '—' : '—',
      room: b.room?.room_number ?? '—',
      type: b.room?.type ?? '—',
      checkIn: formatShortDate(b.check_in),
      checkOut: formatShortDate(b.check_out),
      status: b.status,
      amount: formatMoney(b.total_amount),
      actions: 'View / Edit',
    }));
  }, [apiBookings]);

  const bookings = useMemo(() => {
    if (!sortConfig) return bookingRows;
    const { key, direction } = sortConfig;
    const dir = direction === 'ascending' ? 1 : -1;
    return [...bookingRows].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      if (key === 'amount') {
        aVal = parseFloat(String(a[key]).replace(/[^0-9.-]/g, ''), 10);
        bVal = parseFloat(String(b[key]).replace(/[^0-9.-]/g, ''), 10);
      }
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });
  }, [bookingRows, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (!sortConfig || sortConfig.key !== name) return <span className="opacity-0 group-hover:opacity-50 ml-1 text-[10px]">▼</span>;
    return <span className="ml-1 text-[10px] text-emerald-500">{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in duration-700 h-full pb-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 font-medium">Welcome back. Press <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-medium shadow-sm ml-1">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-medium shadow-sm">K</kbd> for Quick Actions.</p>
        </div>
      </div>

      <div className={cn('grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6', overviewLoading && 'animate-pulse')}>
        <KpiCard 
          title="Total Rooms" 
          value={overviewLoading ? '—' : totalRooms} 
          icon={Bed} 
          trend="up" 
          percentage="0" 
          topBorderColor="border-t-emerald-500"
          iconColor="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-100 dark:bg-emerald-500/20"
          sparklineColor="#10b981"
        />
        <KpiCard 
          title="Available" 
          value={overviewLoading ? '—' : availableRooms} 
          icon={DoorOpen} 
          trend="down" 
          percentage="0" 
          topBorderColor="border-t-blue-500"
          iconColor="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-500/20"
          sparklineColor="#3b82f6"
        />
        <KpiCard 
          title="Occupied" 
          value={overviewLoading ? '—' : occupiedRooms} 
          icon={DoorClosed} 
          trend="up" 
          percentage="0" 
          topBorderColor="border-t-amber-500"
          iconColor="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-100 dark:bg-amber-500/20"
          sparklineColor="#f59e0b"
        />
        <KpiCard 
          title="Revenue" 
          value={overviewLoading ? '—' : totalRevenue} 
          icon={Wallet} 
          trend="up" 
          percentage="0" 
          topBorderColor="border-t-purple-500"
          iconColor="text-purple-600 dark:text-purple-400"
          bgColor="bg-purple-100 dark:bg-purple-500/20"
          sparklineColor="#a855f7"
        />
      </div>

      <div className="w-full gap-6">
        {/* Revenue Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm w-full flex flex-col hover:shadow-md transition-shadow duration-300">
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
      </div>

      {/* Room Status Floor Map */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm p-5 md:p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">Room Status — Floor View</h2>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
             {[{label:'Available', color:'bg-emerald-500'}, {label:'Occupied', color:'bg-blue-500'}, {label:'Maintenance', color:'bg-rose-500'}, {label:'Other', color:'bg-amber-500'}].map(leg => (
               <div key={leg.label} className="flex items-center gap-1.5">
                 <div className={cn("w-2.5 h-2.5 rounded-full", leg.color)}></div>
                 <span className="text-xs font-medium text-[var(--text-muted)]">{leg.label}</span>
               </div>
             ))}
          </div>
        </div>
        
        <div className="grid gap-5 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
          {[1,2,3].map((floor) => (
            <div key={floor} className="flex items-center gap-4 min-w-max">
              <span className="text-sm font-medium text-[var(--text-muted)] w-14 shrink-0">Floor {floor}</span>
              <div className="flex gap-2.5">
                {(floorChunks[floor - 1] ?? []).map((room) => {
                  const label = String(room.room_number ?? room.id ?? '').slice(0, 4);
                  return (
                  <div 
                    key={room.id}
                    title={`Room ${room.room_number ?? room.id} — ${room.status}`}
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-xs font-semibold text-white shadow-sm cursor-pointer transition-transform hover:scale-105",
                      room.status === 'Available' ? "bg-emerald-500" :
                      room.status === 'Occupied' ? "bg-blue-500" :
                      room.status === 'Maintenance' ? "bg-rose-500" :
                      "bg-amber-500"
                    )}
                  >
                    {label || '—'}
                  </div>
                  );
                })}
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
                      booking.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                      booking.status === 'Cancelled' ? 'bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' :
                      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-[var(--text-primary)]">{booking.amount}</td>
                  <td className="py-4 px-6 text-sm font-medium">
                    <button 
                      onClick={() => console.log('Action clicked for booking ID:', booking.id)}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20 rounded p-1 -m-1"
                    >
                      {booking.actions}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
