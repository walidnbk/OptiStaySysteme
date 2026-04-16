import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

const initialRooms = [
  { id: '101', type: 'Suite', price: 250, status: 'Available', capacity: '2 Adults, 1 Child' },
  { id: '102', type: 'Single', price: 100, status: 'Occupied', capacity: '1 Adult' },
  { id: '103', type: 'Double', price: 150, status: 'Maintenance', capacity: '2 Adults' },
  { id: '201', type: 'Suite', price: 250, status: 'Occupied', capacity: '2 Adults, 2 Children' },
  { id: '202', type: 'Double', price: 150, status: 'Available', capacity: '2 Adults' },
  { id: '203', type: 'Single', price: 100, status: 'Available', capacity: '1 Adult' },
  { id: '301', type: 'Double', price: 150, status: 'Available', capacity: '2 Adults' },
];

const today = new Date();
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const initialBookings = [
  { id: 'BK-1023', guest: 'Michael Chen', room: '101', checkIn: formatDate(addDays(today, -2)), checkOut: formatDate(addDays(today, 2)), status: 'Confirmed', amount: 850 },
  { id: 'BK-1024', guest: 'Emma Watson', room: '202', checkIn: formatDate(addDays(today, 1)), checkOut: formatDate(addDays(today, 4)), status: 'Pending', amount: 320 },
  { id: 'BK-1025', guest: 'James Smith', room: '102', checkIn: formatDate(today), checkOut: formatDate(addDays(today, 1)), status: 'Confirmed', amount: 150 },
  { id: 'BK-1026', guest: 'Sarah Connor', room: '201', checkIn: formatDate(addDays(today, -5)), checkOut: formatDate(addDays(today, -1)), status: 'Cancelled', amount: 1200 },
];

const initialCustomers = [
  { id: 'CUST-001', name: 'Michael Chen', email: 'michael.c@example.com', phone: '+1 (555) 123-4567', totalBookings: 3, status: 'VIP' },
  { id: 'CUST-002', name: 'Emma Watson', email: 'emma.w@example.com', phone: '+1 (555) 987-6543', totalBookings: 1, status: 'Active' },
  { id: 'CUST-003', name: 'James Smith', email: 'jsmith@example.com', phone: '+1 (555) 456-7890', totalBookings: 5, status: 'VIP' },
  { id: 'CUST-004', name: 'Sarah Connor', email: 's.connor@example.com', phone: '+1 (555) 789-0123', totalBookings: 2, status: 'Active' },
  { id: 'CUST-005', name: 'John Doe', email: 'johndoe@example.com', phone: '+1 (555) 000-0000', totalBookings: 0, status: 'Blacklisted' },
];

export function DataProvider({ children }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  const [customers, setCustomers] = useState(initialCustomers);

  const addRoom = (room) => setRooms([...rooms, room]);
  const updateRoom = (room) => setRooms(rooms.map(r => r.id === room.id ? room : r));
  const deleteRoom = (id) => setRooms(rooms.filter(r => r.id !== id));

  const addBooking = (booking) => setBookings([...bookings, booking]);
  const updateBooking = (booking) => setBookings(bookings.map(b => b.id === booking.id ? booking : b));
  const deleteBooking = (id) => setBookings(bookings.filter(b => b.id !== id));

  const addCustomer = (customer) => setCustomers([...customers, customer]);
  const updateCustomer = (customer) => setCustomers(customers.map(c => c.id === customer.id ? customer : c));
  const deleteCustomer = (id) => setCustomers(customers.filter(c => c.id !== id));

  return (
    <DataContext.Provider value={{
      rooms, addRoom, updateRoom, deleteRoom,
      bookings, addBooking, updateBooking, deleteBooking,
      customers, addCustomer, updateCustomer, deleteCustomer
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
