import React, { useEffect, useState } from 'react';
import API from '../api/axios';


const BarberAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Varsayılan tarih bugünün tarihi
  const [showPopup, setShowPopup] = useState(false);
  const barberId = localStorage.getItem("id"); // localStorage'dan barberId çekme

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Yükleniyor durumunu güncelle
      try {
        const response = await API.get(`/appointments/barberSummary/${barberId}`, {
          params: { date: selectedDate }
        });
        setAppointments(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setShowPopup(true);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [barberId, selectedDate]);

  const updateAppointmentStatus = async (appId, time, status) => {
    try {
      await API.put(`/appointments/updateStatus/${appId}`, null, {
        params: {
          time,
          status
        }
      });
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.appId === appId 
          ? { ...appointment, status: status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED', [`t${time}`]: status === 'ACCEPTED' ? 'T' : 'F' }
          : appointment
        )
      );
      alert('Randevu durumu güncellendi.');
    } catch (err) {
      setError(err);
      alert('Randevu durumu güncellenirken bir hata oluştu.');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Bekliyor';
      case 'ACCEPTED':
        return 'Kabul Edildi';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return '';
    }
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

  const formatDate = (date) => {
    if (typeof date === 'string') {
      return date.split('-').reverse().join('-');
    } else {
      return date;
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error && error.response && error.response.status !== 403) return <p>Hata: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Berber Randevuları</h2>
      <div className="mb-4">
        <label className="mr-2">Tarih Seç:</label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className="border px-2 py-1"
        />
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Bu tarihte randevu bulunmamaktadır.</p>
            <button 
              onClick={handleClosePopup} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Tarih</th>
              <th className="px-4 py-2 border-b">Saat</th>
              <th className="px-4 py-2 border-b">Durum</th>
              <th className="px-4 py-2 border-b">Hizmetler</th>
              <th className="px-4 py-2 border-b">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.appId} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{appointment.appId}</td>
                <td className="px-4 py-2 border-b">{formatDate(appointment.date)}</td>
                <td className="px-4 py-2 border-b">{getTimeText(appointment.time)}</td>
                <td className="px-4 py-2 border-b">{getStatusText(appointment.status)}</td>
                <td className="px-4 py-2 border-b">{appointment.services}</td>
                <td className="px-4 py-2 border-b">
                  {appointment.status === 'PENDING' && (
                    <div className="space-x-2">
                      <button 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => updateAppointmentStatus(appointment.appId, appointment.time, 'ACCEPTED')}
                      >
                        Kabul Et
                      </button>
                      <button 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => updateAppointmentStatus(appointment.appId, appointment.time, 'REJECTED')}
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarberAppointments;
