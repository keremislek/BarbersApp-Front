import { Link, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from '../api/axios';
import React, { useEffect, useState } from 'react';



const AddressPopup = ({ onClose,barberId }) => {
  const [fullAddress, setFullAddress] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await API.get('/address/districts');
        setDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    fetchDistricts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = {
        fullAddress,
        barberId: barberId,
        districtId: selectedDistrict,
      };

      await API.post('/addressesInfo/create', requestData);
      alert('Adres başarıyla oluşturuldu.');
      onClose();
    } catch (error) {
      console.error('Error creating address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md">
        <h2 className="text-xl font-bold mb-4">Adres Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="district">İlçe:</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            >
              <option value="">İlçe Seçiniz</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="fullAddress">Adres:</label>
            <input
              type="text"
              id="fullAddress"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
              disabled={isLoading}
            >
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




const BarberHome = () => {
  const token = localStorage.getItem("token");
  const barberId = localStorage.getItem("id");
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [servicesInfo, setServicesInfo] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [services, setServices] = useState([]);
  const [service, setService] = useState('');
  const [workHours, setWorkHours] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    if (!token) {
      console.error("Token bulunamadı");
      return;
    }
    const fetchData = async () => {
      try {
        const barberResponse = await API.get(`/barbers/${barberId}`);
        setBarbers(barberResponse.data);

        const servicesResponse = await API.get(`/servicesInfo/barber/${barberId}`);
        setServicesInfo(servicesResponse.data);

        const allServicesResponse = await API.get("/services");
        setServices(allServicesResponse.data);

        const availableResponse = await API.get(`/appointments/available/${barberId}`);
        setAvailableHours(availableResponse.data);

  

      } catch (error) {
        console.error("Fetch Data Error: ", error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, [token, barberId]);

  useEffect(() => {
    const hours = Array(12).fill().map((_, index) => ({
      hour: (9 + index) % 24,
      disabled: availableHours[`t${index + 1}`] === 'T',
      color: availableHours[`t${index + 1}`] === 'T' ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-700'
    }));
    setWorkHours(hours);
  }, [availableHours]);

  const handleHourClick = (hour) => {
    if (!availableHours[`t${hour}`] === 'T') {
      console.log(`Selected hour: ${hour}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/servicesInfo/create', {
        time,
        price,
        serviceId: service,
        barberId
      });
      alert("Hizmet Başarıyla Eklendi");
    } catch (error) {
      console.error('Error creating service info: ', error);
    }
  };

  if (!token) {
    return null;
  }

  const tokenString = token.toString();
  const decoded = jwtDecode(tokenString);
  const firstRole = decoded.role[0].authority;

  if (firstRole === "Customer") {
    return <Navigate to="/" />;
  }

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e, setterFunction) => {
    setterFunction(e.target.value);
  };

  return (
    <div className="font-sans">
      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-bold mb-4">Hizmet Ekle</h2>
            <form onSubmit={handleSubmit}>
              <select value={service} onChange={(e) => handleInputChange(e, setService)} className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full">
                <option value="">Servis Seçiniz</option>
                {services.map(option => (
                  <option key={option.id} value={option.id}>{option.serviceName}</option>
                ))}
              </select>
              <input type="number" placeholder="Fiyat (TL)" value={price} onChange={(e) => handleInputChange(e, setPrice)} className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" />
              <input type="number" placeholder="Zaman (Dakika)" value={time} onChange={(e) => handleInputChange(e, setTime)} className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full" />
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2">Kaydet</button>
                <button type="button" onClick={closePopup} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md">İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto py-8">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="w-full lg:h-72 mt-0 top-0 text-center">
            <h2 className="text-left font-bold text-gray-800 mt-4">{barbers.barberName}</h2>
            <img src={barbers.photoUrl} width="200" height="200" alt="Product" className="lg:w-10/12 w-full h-full rounded-xl object-cover object-top mx-auto" />
            <div className="flex items-center justify-center mt-4">
              <button type="button" className="px-4 py-2 bg-pink-500 text-white rounded-md flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                {barbers.rate}
              </button>
              <button type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md flex items-center ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M14.236 21.954h-3.6c-.91 0-1.65-.74-1.65-1.65v-7.201c0-.91.74-1.65 1.65-1.65h3.6a.75.75 0 0 1 .75.75v9.001a.75.75 0 0 1-.75.75zm-3.6-9.001a.15.15 0 0 0-.15.15v7.2a.15.15 0 0 0 .15.151h2.85v-7.501z" data-original="#000000" />
                  <path d="M20.52 21.954h-6.284a.75.75 0 0 1-.75-.75v-9.001c0-.257.132-.495.348-.633.017-.011 1.717-1.118 2.037-3.25.18-1.184 1.118-2.089 2.28-2.201a2.557 2.557 0 0 1 2.17.868c.489.56.71 1.305.609 2.042a9.468 9.468 0 0 1-.678 2.424h.943a2.56 2.56 0 0 1 1.918.862c.483.547.708 1.279.617 2.006l-.675 5.401a2.565 2.565 0 0 1-2.535 2.232zm-5.534-1.5h5.533a1.06 1.06 0 0 0 1.048-.922l.675-5.397a1.046 1.046 0 0 0-1.047-1.182h-2.16a.751.751 0 0 1-.648-1.13 8.147 8.147 0 0 0 1.057-3 1.059 1.059 0 0 0-.254-.852 1.057 1.057 0 0 0-.795-.365c-.577.052-.964.435-1.04.938-.326 2.163-1.71 3.507-2.369 4.036v7.874z" data-original="#000000" />
                  <path d="M4 31.75a.75.75 0 0 1-.612-1.184c1.014-1.428 1.643-2.999 1.869-4.667.032-.241.055-.485.07-.719A14.701 14.701 0 0 1 1.25 15C1.25 6.867 7.867.25 16 .25S30.75 6.867 30.75 15 24.133 29.75 16 29.75a14.57 14.57 0 0 1-5.594-1.101c-2.179 2.045-4.61 2.81-6.281 3.09A.774.774 0 0 1 4 31.75zm12-30C8.694 1.75 2.75 7.694 2.75 15c0 3.52 1.375 6.845 3.872 9.362a.75.75 0 0 1 .217.55c-.01.373-.042.78-.095 1.186A11.715 11.715 0 0 1 5.58 29.83a10.387 10.387 0 0 0 3.898-2.37l.231-.23a.75.75 0 0 1 .84-.153A13.072 13.072 0 0 0 16 28.25c7.306 0 13.25-5.944 13.25-13.25S23.306 1.75 16 1.75z" data-original="#000000" />
                </svg>
                {barbers.commentSize}
              </button>
            </div>
            {barbers.address === "Bilinmeyen Adres" ? (
              <div>
        <p className="text-red-600 animate-blink mt-2">
          Adres eklemediniz, adres ekleyiniz
        </p>
        <button type="button" onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
      Adres Ekle
    </button>
    {showModal && <AddressPopup  onClose={closeModal} barberId={barberId} />}
        </div>
        
      ) : (
        <div>
        <p className="text-gray-700 mt-2">{barbers.address}</p>
        </div>
      )}
            
          </div>

          <div className="ml-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Berber Ana Sayfa</h2>
                <p className="text-sm text-gray-400">Bilgilerinizi, hizmetlerinizi görüntüleyebilir ve değiştirebilirsiniz</p>
              </div>
              <div>
                <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                  <Link to="/barberInfo">Bilgilerimi Güncelle</Link>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800">Hizmetlerim </h3>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Hizmet Adı</th>
                    <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Fiyat</th>
                    <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Zaman (Dakika)</th>

                    <th><button onClick={openPopup} className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md">Hizmet Ekle</button></th>
                  </tr>
                </thead>
                <tbody>
                  {servicesInfo.map((service, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border border-gray-200">{service.serviceName}</td>
                      <td className="py-2 px-4 border border-gray-200">{service.price}</td>
                      <td className="py-2 px-4 border border-gray-200">{service.time}</td>
                      <td>
                        <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2">Güncelle</button>
                        <button type="button" className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md">Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800">Çalışma Saatleri</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {workHours.map((hourData, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-12 h-12 border-2 hover:border-gray-800 font-semibold text-sm rounded-full flex items-center justify-center ${hourData.color}`}
                    onClick={() => handleHourClick(hourData.hour)}
                    disabled={hourData.disabled}
                  >
                    {hourData.hour < 10 ? "0" + hourData.hour : hourData.hour}:00
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarberHome;
