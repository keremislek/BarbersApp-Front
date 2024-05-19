import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { CgUserAdd } from 'react-icons/cg'
import { FiLogIn } from 'react-icons/fi'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import API from '../api/axios'


export default function Header() {

  const [customer, setCustomer] = useState({});
  const [barber, setBarbers] = useState({});

  const token = localStorage.getItem("token")
  const id = localStorage.getItem("id");
  let tokenString = null;
  let decoded = null;
  let firstRole = null;
  if (token) {
    tokenString = token.toString();
    decoded = jwtDecode(tokenString);
    firstRole = decoded.role[0].authority;
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (firstRole === "Barber") {
          const barberResponse = await API.get(`/barbers/${id}`);
          setBarbers(barberResponse.data);
        }

        if (firstRole === "Customer") {
          const customerResponse = await API.get(`/customers/${id}`);
          setCustomer(customerResponse.data)
        }

      } catch (error) {
        console.error("Fetch Data Error: ", error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, []);

  const { logout } = useAuth(); // AuthProvider'dan logout fonksiyonunu al

  const handleLogout = () => {
    logout(); 
    // Çıkış yap
    // Yönlendirme yap
    return <Navigate to="/" />; 
  };



  return (
    <div className='bg-brand-color h-11'>
      <div className='container mx-auto h-11 flex items-center justify-between'>
        <div>
          {firstRole === "Customer" && (
            <nav className='flex gap-x-8 text-sm font-semibold'>
              <Link to="/" className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'>Hoşgeldin : {customer.firstName}</Link>
            </nav>
          )}
        </div>
        <div>
          {firstRole === "Customer" && (
            <nav className='flex gap-x-8 text-sm font-semibold'>
              <Link to='/customerAppointments' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'><FiLogIn size={20} /> Randevularım</Link>
              <Link onClick={handleLogout} className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'><CgUserAdd size={20} />Çıkış Yap</Link>
            </nav>
          )}
          {
            firstRole === "Barber" && (
              <nav className='flex gap-x-8 text-sm font-semibold'>
                <Link to="/" className='lex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'>Hoşgeldin : {barber.barberName} </Link>
                <Link to='/barberAppointments' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'><FiLogIn size={20} /> Randevularım</Link>
                <Link onClick={handleLogout} className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80' ><CgUserAdd size={20} />Çıkış Yap</Link>
              </nav>
            )
          }
          {
            firstRole !== "Barber" && firstRole !== "Customer" && (
              <nav className='flex gap-x-8 text-sm font-semibold'>
                <Link to='/login' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80'><FiLogIn size={20} /> Giriş Yap</Link>
                <Link to='/signup' className='flex items-center gap-2 text-white transition-all hover:text-opacity-100 text-opacity-80' ><CgUserAdd size={20} />Kayıt Ol</Link>
              </nav>
            )
          }
        </div>
      </div>
    </div>


  )
}
