import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar as CalendarIcon, CheckCircle2, Clock, XCircle, X, Trash2, Edit2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';

export default function Bookings() {
  const { bookings, rooms, addBooking, updateBooking, deleteBooking } = useData();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const handleOpenModal = (booking = null) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBooking(null);
  };

  const handleDeleteClick = (booking) => {
    setCurrentBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteBooking(currentBooking.id);
    addToast(`Booking ${currentBooking.id} deleted successfully.`);
    setIsDeleteModalOpen(false);
    setCurrentBooking(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inDate = formData.get('checkIn');
    const outDateStr = formData.get('checkOut');
    
    if (new Date(outDateStr) <= new Date(inDate)) {
      addToast('Check-out must be after check-in', 'error');
      return;
    }

    const newBooking = {
      id: currentBooking ? currentBooking.id : `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: formData.get('guest'),
      room: formData.get('room'),
      checkIn: inDate,
      checkOut: outDateStr,
      status: formData.get('status') || 'Confirmed',
      amount: currentBooking ? currentBooking.amount : Math.floor(Math.random() * 500) + 150,
    };

    if (currentBooking) {
      updateBooking(newBooking);
      addToast(`Booking ${newBooking.id} updated successfully.`);
    } else {
      addBooking(newBooking);
      addToast('Booking successfully created.');
    }
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage guest reservations and upcoming stays.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-50/500 transition shadow-sm shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Booking
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by guest or ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
            />
          </div>
          <button className="p-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 flex items-center gap-2 bg-white dark:bg-[#1E293B]">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-bold hidden sm:inline">Date Range</span>
          </button>
          <button className="p-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 bg-white dark:bg-[#1E293B]">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 w-full sm:w-auto justify-end">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <button className="px-3 py-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-slate-800 dark:text-white font-bold text-xs">All</button>
            <button className="px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-xs rounded-lg transition border border-transparent">Confirmed</button>
            <button className="px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-xs rounded-lg transition border border-transparent">Pending</button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Booking ID</th>
                <th className="py-4 px-6 font-bold">Guest Name</th>
                <th className="py-4 px-6 font-bold">Room</th>
                <th className="py-4 px-6 font-bold">Check-In</th>
                <th className="py-4 px-6 font-bold">Check-Out</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">No bookings found. Start by creating a booking.</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors last:border-0 group cursor-pointer">
                  <td className="py-4 px-6 text-sm font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{booking.id}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-3 font-semibold">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {booking.guest.charAt(0)}
                      </div>
                      {booking.guest}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 font-semibold">{booking.room}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 font-medium">{booking.checkIn}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 font-medium">{booking.checkOut}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border flex w-max items-center gap-1.5",
                      booking.status === 'Confirmed' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200 dark:bg-emerald-50/500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                      booking.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    )}>
                      {booking.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-200 text-right">${booking.amount}</td>
                  <td className="py-4 px-6 text-sm text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(booking); }}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-50/500/10 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(booking); }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/60 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{currentBooking ? 'Edit Booking' : 'Create New Booking'}</h3>
              <button type="button" onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Guest Name</label>
                <input required defaultValue={currentBooking?.guest} name="guest" type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Room Assignment</label>
                <select required defaultValue={currentBooking?.room || ''} name="room" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white">
                  <option value="" disabled>Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.id} - {room.type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Check-in Date</label>
                  <input required defaultValue={currentBooking?.checkIn} name="checkIn" type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Check-out Date</label>
                  <input required defaultValue={currentBooking?.checkOut} name="checkOut" type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" />
                </div>
              </div>
              
              {currentBooking && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                  <select defaultValue={currentBooking.status} name="status" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white">
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              )}

              <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-50/500 rounded-xl transition shadow-sm shadow-emerald-500/20">
                  {currentBooking ? 'Save Changes' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-200/60 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border-4 border-rose-50 dark:border-rose-500/10">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Booking?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Are you sure you want to delete booking {currentBooking?.id}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentBooking(null);
                }} 
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition w-full"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-sm shadow-rose-500/20 w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
