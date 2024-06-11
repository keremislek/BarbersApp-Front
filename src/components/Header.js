import React, { useEffect, useState } from 'react';
import { BiGlobe } from 'react-icons/bi';
import { CgUserAdd } from 'react-icons/cg';
import { FiLogIn } from 'react-icons/fi';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {jwtDecode} from 'jwt-decode';

export default function Header() {
  const [customer, setCustomer] = useState({});
  const [barber, setBarber] = useState({});
  const { token, isAuthenticated, id, logout } = useAuth();
  const [firstRole, setFirstRole] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setFirstRole(decoded.role[0].authority);

      const fetchData = async () => {
        try {
          if (decoded.role[0].authority === "Barber") {
            const barberResponse = await API.get(`/barbers/${id}`);
            setBarber(barberResponse.data);
          }

          if (decoded.role[0].authority === "Customer") {
            const customerResponse = await API.get(`/customers/${id}`);
            setCustomer(customerResponse.data);
          }
        } catch (error) {
          console.error("Fetch Data Error: ", error.response ? error.response.data : error.message);
        }
      };

      fetchData();
    } else {
      setFirstRole(null); // Logout durumunda firstRole'u sıfırla
    }
  }, [token, id]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-brand-color h-11">
      <div className="container mx-auto h-11 flex items-center justify-between">
        <div>
          {isAuthenticated && firstRole === "Customer" && (
            <nav className="flex gap-x-8 text-sm font-semibold">
              <Link
                to="/"
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                Hoşgeldin : {customer.firstName}
              </Link>
            </nav>
          )}
          {isAuthenticated && firstRole === "Barber" && (
            <nav className="flex gap-x-8 text-sm font-semibold">
              <Link
                to="/"
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                Hoşgeldin : {barber.barberName}
              </Link>
            </nav>
          )}
        </div>
        <div>
          {isAuthenticated && firstRole === "Customer" && (
            <nav className="flex gap-x-8 text-sm font-semibold">
              <Link
                to="/customerAppointments"
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                <FiLogIn size={20} /> Randevularım
              </Link>
              <Link
                onClick={handleLogout}
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                <CgUserAdd size={20} /> Çıkış Yap
              </Link>
            </nav>
          )}
          {isAuthenticated && firstRole === "Barber" && (
            <nav className="flex gap-x-8 text-sm font-semibold">
              <Link
                to="/barberAppointments"
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                <FiLogIn size={20} /> Randevularım
              </Link>
              <Link
                onClick={handleLogout}
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                <CgUserAdd size={20} /> Çıkış Yap
              </Link>
            </nav>
          )}
          {!isAuthenticated && (
            <nav className="flex gap-x-8 text-sm font-semibold">
              <Link
                to="/login"
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                <FiLogIn size={20} /> Giriş Yap
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80"
              >
                <CgUserAdd size={20} /> Kayıt Ol
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
