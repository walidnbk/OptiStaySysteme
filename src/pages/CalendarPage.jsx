import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';

export default function CalendarPage() {
  const { rooms, bookings, addBooking } = useData();
  const { addToast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const days = useMemo(() => {
    const list = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - 3); 
    
    for (let i = 0; i < 14; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      list.push(day);
    }
    return list;
  }, [currentDate]);

  const nextPeriod = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateString = (date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  const getBookingsForRoom = (roomId) => {
    return bookings.filter(b => b.room === roomId);
  };

  const getBookingGridPosition = (booking, daysArray) => {
    const startDate = new Date(daysArray[0]);
    startDate.setHours(0,0,0,0);
    
    const endDate = new Date(daysArray[daysArray.length - 1]);
    endDate.setHours(0,0,0,0);
    endDate.setDate(endDate.getDate() + 1); // Exclusive end of the time window

    // Parse YYYY-MM-DD reliably
    const [inY, inM, inD] = booking.checkIn.split('-');
    const bCheckIn = new Date(inY, inM - 1, inD);
    
    const [outY, outM, outD] = booking.checkOut.split('-');
    const bCheckOut = new Date(outY, outM - 1, outD);

    // Completely out of range
    if (bCheckOut <= startDate || bCheckIn >= endDate) return null;

    const visibleStart = bCheckIn < startDate ? startDate : bCheckIn;
    const visibleEnd = bCheckOut > endDate ? endDate : bCheckOut;

    const diffTimeStart = visibleStart.getTime() - startDate.getTime();
    const startColIndex = Math.round(diffTimeStart / (1000 * 60 * 60 * 24)) + 1; 

    const diffTimeEnd = visibleEnd.getTime() - startDate.getTime();
    const endColIndex = Math.round(diffTimeEnd / (1000 * 60 * 60 * 24)) + 1;
    
    let span = endColIndex - startColIndex;
    if (span < 1) span = 1;

    const isCutStart = bCheckIn < startDate;
    const isCutEnd = bCheckOut > endDate;

    return { gridColumn: `${startColIndex} / span ${span}`, isCutStart, isCutEnd };
  };

  const handleCellClickEmpty = (room, dateStr) => {
    setSelectedRoom(room.id);
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleBookingClick = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inDate = formData.get('checkIn');
    const outDateStr = formData.get('checkOut');
    const outDate = new Date(outDateStr);
    const checkInD = new Date(inDate);

    if (outDate <= checkInD) {
      addToast('Check-out must be after check-in', 'error');
      return;
    }

    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: formData.get('guest'),
      room: formData.get('room'),
      checkIn: inDate,
      checkOut: outDateStr,
      status: formData.get('status'),
      amount: Math.floor(Math.random() * 300) + 100,
    };

    addBooking(newBooking);
    addToast('Booking successfully created', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 h-[calc(100vh-120px)] w-full overflow-hidden">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 px-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Pro Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Professional PMS occupancy single-bar timeline.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-1">
            <button onClick={prevPeriod} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors focus:ring-2 ring-emerald-500/20">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={jumpToToday} className="px-5 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-l border-r border-slate-100 dark:border-slate-800">
              Today
            </button>
            <button onClick={nextPeriod} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors focus:ring-2 ring-emerald-500/20">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => { setSelectedRoom(''); setSelectedDate(formatDateString(new Date())); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 px-1 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>Confirmed</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span>Pending</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span>Cancelled</div>
      </div>

      {/* Main Calendar Body Container */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex-1 overflow-hidden relative">
        <div className="w-full h-full overflow-auto no-scrollbar">
          <div className="min-w-max pb-32">
            
            {/* Header Row */}
            <div className="flex border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-40 bg-white dark:bg-[#1E293B]">
              <div className="w-[200px] shrink-0 p-4 font-bold text-slate-700 dark:text-slate-300 text-sm sticky left-0 z-50 border-r border-slate-200/60 dark:border-slate-800 flex items-center bg-white dark:bg-[#1E293B] shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
                Rooms ({rooms.length})
              </div>
              <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(14, minmax(120px, 1fr))' }}>
                {days.map((day, i) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = day.getDate();
                  const monthName = day.toLocaleDateString('en-US', { month: 'short' });
                  
                  return (
                    <div key={i} className={cn(
                      "p-3 text-center border-r border-slate-200/50 dark:border-slate-800/60 flex flex-col items-center justify-center relative",
                      isToday ? "bg-emerald-50/50 dark:bg-emerald-500/10" : ""
                    )}>
                      <span className={cn("text-xs font-bold uppercase", isToday ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500")}>
                        {dayName}
                      </span>
                      <span className={cn(
                        "text-lg font-bold mt-1 h-8 w-8 flex items-center justify-center rounded-full transition-transform hover:scale-110",
                        isToday ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "text-slate-800 dark:text-slate-200"
                      )}>
                        {dayNum}
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{monthName}</span>
                      {isToday && <div className="absolute bottom-0 w-full h-1.5 bg-emerald-500 rounded-t-sm" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Rows */}
            {rooms.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">No rooms configured.</div>
            ) : rooms.map((room) => (
              <div key={room.id} className="flex border-b border-slate-100 dark:border-slate-800/60 group">
                
                {/* Fixed Room Column */}
                <div className="w-[200px] shrink-0 p-4 bg-white dark:bg-[#1E293B] sticky left-0 z-30 border-r border-slate-200/60 dark:border-slate-800 flex flex-col justify-center shadow-[4px_0_12px_rgba(0,0,0,0.02)] group-hover:bg-slate-50/80 dark:group-hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full shadow-sm",
                      room.status === 'Available' ? 'bg-emerald-400 shadow-emerald-400/50' : 
                      room.status === 'Occupied' ? 'bg-amber-400 shadow-amber-400/50' : 'bg-rose-400 shadow-rose-400/50'
                    )}></div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-sm">Room {room.id}</div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{room.type}</div>
                    </div>
                  </div>
                </div>

                {/* Days Grid -> Background Empty Cells + Overlaid Continuous Booking Bars */}
                <div className="flex-1 grid relative group" style={{ gridTemplateColumns: 'repeat(14, minmax(120px, 1fr))' }}>
                  
                  {/* Layer 1: The empty background grid cells */}
                  {days.map((day, i) => {
                     const dateStr = formatDateString(day);
                     return (
                      <div 
                        key={`empty-${i}`} 
                        onClick={() => handleCellClickEmpty(room, dateStr)}
                        className="border-r border-slate-50 dark:border-slate-800/40 flex items-center justify-center min-h-[80px] hover:bg-slate-100/50 dark:hover:bg-slate-700/30 cursor-pointer group/cell relative"
                        style={{ gridColumn: i + 1, gridRow: 1 }}
                      >
                          <Plus className="w-5 h-5 text-slate-400 dark:text-slate-500 scale-50 opacity-0 group-hover/cell:opacity-100 group-hover/cell:scale-100 transition-all" />
                      </div>
                    );
                  })}

                  {/* Layer 2: The Continuous Booking Bars natively spanning columns in the grid */}
                  {getBookingsForRoom(room.id).map(b => {
                      const pos = getBookingGridPosition(b, days);
                      if (!pos) return null;
                      
                      return (
                        <div 
                          key={b.id}
                          onClick={(e) => handleBookingClick(b, e)}
                          style={{ gridColumn: pos.gridColumn, gridRow: 1 }}
                          className={cn(
                              "z-10 mx-1 my-2 p-2 rounded-xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-center overflow-hidden border",
                              b.status === 'Confirmed' ? 'bg-emerald-100/90 text-emerald-800 border-emerald-500 border-l-[6px] dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40' :
                              b.status === 'Pending' ? 'bg-amber-100/90 text-amber-800 border-amber-500 border-l-[6px] dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40' :
                              'bg-rose-100/90 text-rose-800 border-rose-500 border-l-[6px] dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40',
                              pos.isCutStart && 'border-l-0 rounded-l-none',
                              pos.isCutEnd && 'rounded-r-none border-r-0'
                          )}
                        >
                          <span className="font-bold text-sm tracking-tight truncate w-full px-1">{b.guest}</span>
                        </div>
                      );
                  })}
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isBookingDetailsOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/60 dark:border-slate-800 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
                  {selectedBooking.guest.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{selectedBooking.guest}</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Room {selectedBooking.room}</p>
                </div>
              </div>
              <button onClick={() => setIsBookingDetailsOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6 bg-slate-50 dark:bg-[#0F172A] p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Check-in</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedBooking.checkIn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Check-out</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedBooking.checkOut}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Status</span>
                <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md",
                  selectedBooking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                  selectedBooking.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 
                  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                )}>
                  {selectedBooking.status}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Amount</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">${selectedBooking.amount}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 rounded-xl transition text-sm">Edit</button>
              <button 
                onClick={() => setIsBookingDetailsOpen(false)}
                className="flex-[2] px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow shadow-emerald-500/20 text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && !isBookingDetailsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/60 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Booking</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBooking} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Guest Name</label>
                <input autoFocus required name="guest" type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white transition-all font-medium" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Room / Suite</label>
                <select required defaultValue={selectedRoom} name="room" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white transition-all font-medium cursor-pointer">
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>Room {r.id} - {r.type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Check-in</label>
                  <input required defaultValue={selectedDate} name="checkIn" type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Check-out</label>
                  <input required name="checkOut" type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white transition-all font-medium" />
                </div>
              </div>

              <div className="hidden">
                <input type="hidden" name="status" value="Confirmed" />
              </div>

              <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] dark:shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] active:scale-95 hover:-translate-y-0.5">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
