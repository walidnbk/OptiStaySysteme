import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';
import api from '../lib/axios';

export default function Rooms() {
  const { addToast } = useToast();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/rooms?per_page=500');
      setRooms(data?.data ?? []);
    } catch {
      setRooms([]);
      addToast('Could not load rooms. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleOpenModal = (room = null) => {
    setCurrentRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleDeleteClick = (room) => {
    setCurrentRoom(room);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentRoom?.id) return;
    try {
      await api.delete(`/api/rooms/${currentRoom.id}`);
      addToast(`Room ${currentRoom.room_number ?? currentRoom.id} deleted successfully.`);
      setIsDeleteModalOpen(false);
      setCurrentRoom(null);
      fetchRooms();
    } catch {
      addToast('Failed to delete room.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      room_number: String(formData.get('room_number') ?? '').trim(),
      type: String(formData.get('type') ?? ''),
      price_per_night: Number(formData.get('price')),
      status: String(formData.get('status') ?? 'Available'),
      capacity: Math.max(1, parseInt(String(formData.get('capacity')), 10) || 1),
    };

    try {
      if (currentRoom) {
        await api.put(`/api/rooms/${currentRoom.id}`, payload);
        addToast(`Room ${payload.room_number} updated successfully.`);
      } else {
        await api.post('/api/rooms', payload);
        addToast('Room added successfully.');
      }
      handleCloseModal();
      fetchRooms();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not save room.';
      addToast(msg, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Rooms Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage hotel rooms, prices, and status.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-50/500 transition shadow-sm shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search rooms..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20  dark:text-white"
            />
          </div>
          <button type="button" className="p-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 bg-white dark:bg-[#1E293B]">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Room No.</th>
                <th className="py-4 px-6 font-bold">Type</th>
                <th className="py-4 px-6 font-bold">Capacity</th>
                <th className="py-4 px-6 font-bold">Price / Night</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                      <div className="h-10 w-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Loading rooms…</p>
                    </div>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">No rooms found. Start by adding a room.</p>
                    </div>
                  </td>
                </tr>
              ) : rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors last:border-0 group">
                  <td className="py-4 px-6 text-sm font-bold text-slate-800 dark:text-white">{room.room_number}</td>
                  <td className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">{room.type}</td>
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">{room.capacity}</td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-200">${room.price_per_night}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border flex w-max items-center gap-2",
                      room.status === 'Available' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200 dark:bg-emerald-50/500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                      room.status === 'Occupied' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", 
                        room.status === 'Available' ? 'bg-emerald-50/500' : 
                        room.status === 'Occupied' ? 'bg-amber-500' : 'bg-rose-500'
                      )}></span>
                      {room.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={() => handleOpenModal(room)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-50/500/10 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteClick(room)}
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
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/60 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {currentRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Room Number</label>
                <input required defaultValue={currentRoom?.room_number} name="room_number" disabled={!!currentRoom} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white disabled:opacity-50" placeholder="e.g. 101" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                  <select defaultValue={currentRoom?.type || 'Single'} name="type" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white">
                    <option>Single</option>
                    <option>Double</option>
                    <option>Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price / Night ($)</label>
                  <input required defaultValue={currentRoom?.price_per_night} name="price" type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Capacity</label>
                <input required defaultValue={currentRoom?.capacity} name="capacity" type="number" min="1" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" placeholder="2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select defaultValue={currentRoom?.status || 'Available'} name="status" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white">
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-50/500 rounded-xl transition shadow-sm shadow-emerald-500/20">
                  {currentRoom ? 'Save Changes' : 'Add Room'}
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
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Room?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Are you sure you want to delete room {currentRoom?.room_number ?? currentRoom?.id}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button 
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentRoom(null);
                }} 
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition w-full"
              >
                Cancel
              </button>
              <button 
                type="button"
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
