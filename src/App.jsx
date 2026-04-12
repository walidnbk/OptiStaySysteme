import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import CalendarPage from './pages/CalendarPage';

function App() {
  const isAuthenticated = true;

  return (
    <ThemeProvider>
      <DataProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Auth />} />
              
              <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                <Route index element={<Dashboard />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="customers" element={<Customers />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </ToastProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
