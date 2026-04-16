import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Users as UsersIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { cn } from '../utils/cn';

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleOpenModal = (customer = null) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleDeleteClick = (customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteCustomer(currentCustomer.id);
    addToast(`Customer ${currentCustomer.id} deleted successfully.`);
    setIsDeleteModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCustomer = {
      id: currentCustomer?.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      totalBookings: currentCustomer ? currentCustomer.totalBookings : 0,
      status: formData.get('status'),
    };

    if (currentCustomer) {
      updateCustomer(newCustomer);
      addToast(`Customer ${newCustomer.name} updated successfully.`);
    } else {
      addCustomer(newCustomer);
      addToast('Customer added successfully.');
    }
    handleCloseModal();
  };

  const filteroseCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Customer Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage guest profiles, history and statuses.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-50/500 transition shadow-sm shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
            />
          </div>
          <button className="p-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 bg-white dark:bg-[#1E293B]">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Customer</th>
                <th className="py-4 px-6 font-bold">Contact Info</th>
                <th className="py-4 px-6 font-bold">Total Bookings</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteroseCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">No customers found.</p>
                    </div>
                  </td>
                </tr>
              ) : filteroseCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors last:border-0 group">
                  <td className="py-4 px-6 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <span className="font-bold text-slate-600 dark:text-slate-300">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white">{customer.name}</div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    <div className="font-semibold">{customer.email}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{customer.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-200 text-center sm:text-left">{customer.totalBookings}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border flex w-max items-center",
                      customer.status === 'VIP' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                      customer.status === 'Active' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200 dark:bg-emerald-50/500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                      'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20' // Blacklisted/Inactive
                    )}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(customer)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-50/500/10 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(customer)}
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
                {currentCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input required defaultValue={currentCustomer?.name} name="name" type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input required defaultValue={currentCustomer?.email} name="email" type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                  <input required defaultValue={currentCustomer?.phone} name="phone" type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select defaultValue={currentCustomer?.status || 'Active'} name="status" className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white cursor-pointer">
                  <option>Active</option>
                  <option>VIP</option>
                  <option>Blacklisted</option>
                </select>
              </div>
              <div className="mt-4 flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-50/500 rounded-xl transition shadow-sm shadow-emerald-500/20">
                  {currentCustomer ? 'Save Changes' : 'Add Customer'}
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
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Customer?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Are you sure you want to delete {currentCustomer?.name}? All associated records will be preserved but the profile will be removed.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentCustomer(null);
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
