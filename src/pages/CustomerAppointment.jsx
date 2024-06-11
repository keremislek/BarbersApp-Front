import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const CustomerAppointment = () => {
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Bugünün tarihi
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Varsayılan tarih bugünün tarihi
  const [showPopup, setShowPopup] = useState(false); // Popup mesajını kontrol etmek için durum

  useEffect(() => {
    // localStorage'dan userId al
    const userId = localStorage.getItem('id');
    if (userId) {
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    // API'den kullanıcı randevu özetini al
    const fetchUserAppointments = async () => {
      try {
        const response = await API.get(`/appointments/userSummary/${userId}`, {
          params: { date: selectedDate }
        });
        if (response.data.length === 0) {
          setShowPopup(true);
        } else {
          setAppointments(response.data);
        }
      } catch (error) {
        console.error('Error fetching user appointments:', error);
        setShowPopup(true); // Hata durumunda da popup göster
      }
    };

    if (userId) {
      fetchUserAppointments();
    }
  }, [userId, selectedDate]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const getTimeText = (time) => {
    const timeMap = {
      t1: '09:00',
      t2: '10:00',
      t3: '11:00',
      t4: '12:00',
      t5: '13:00',
      t6: '14:00',
      t7: '15:00',
      t8: '16:00',
      t9: '17:00',
      t10: '18:00',
      t11: '19:00',
      t12: '20:00'
    };
    return timeMap[time] || time;
  };

  const getStatusText = (status) => {
    const statusMap = {
      ACCEPTED: 'Onaylandı',
      REJECTED: 'Reddedildi',
      PENDING: 'Onay Bekliyor',
      CANCELLED: 'İptal Edildi'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Randevu Özetiniz</h1>
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-md">
          <label htmlFor="date" className="block text-lg font-medium text-gray-700">Tarih Seçin:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Randevular:</h2>
        {appointments.length > 0 ? (
          <ul className="space-y-4">
            {appointments.map((appointment) => (
              <li key={appointment.appId} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="text-gray-600"><span className="font-semibold">Berber Adı:</span> {appointment.barberName}</p>
                <p className="text-gray-600"><span className="font-semibold">Kullanıcı Adı:</span> {appointment.customerName}</p>
                <p className="text-gray-600"><span className="font-semibold">Hizmetler:</span> {appointment.services}</p>
                <p className="text-gray-600"><span className="font-semibold">Durum:</span> {getStatusText(appointment.status)}</p>
                <p className="text-gray-600"><span className="font-semibold">Tarih:</span> 16/05/2024</p>
                <p className="text-gray-600"><span className="font-semibold">Saat:</span> {getTimeText(appointment.time)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Randevunuz bulunmamaktadır.</p>
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium text-gray-800">Bu tarihte randevunuz yok.</p>
            <button 
              onClick={handleClosePopup} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAppointment;
