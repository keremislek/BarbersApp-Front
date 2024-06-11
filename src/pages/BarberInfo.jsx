import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCgwj1IRROxAt8DXC3f5T-5bKwyLl2p1YM",
  authDomain: "barber-app-169e6.firebaseapp.com",
  projectId: "barber-app-169e6",
  storageBucket: "barber-app-169e6.appspot.com",
  messagingSenderId: "214947272707",
  appId: "1:214947272707:web:9b2abe12b7921631fcd636",
  measurementId: "G-D7RKGKKMHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function BarberInfo() {
  const [barbers, setBarbers] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [districts, setDistricts] = useState([]);
  const [successMessageEmail, setSuccessMessageEmail] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [successMessageAddress, setSuccessMessageAddress] = useState('');
  const [errorMessageAddress, setErrorMessageAddress] = useState('');
  const [successMessagePhoto, setSuccessMessagePhoto] = useState('');
  const [errorMessagePhoto, setErrorMessagePhoto] = useState('');
  const [barberName, setBarberName] = useState('');
  const [successMessageName, setSuccessMessageName] = useState('');
  const [errorMessageName, setErrorMessageName] = useState('');

  const barberId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      console.error('Token bulunamadı');
      return;
    }

    const fetchData = async () => {
      try {
        const barberResponse = await API.get(`/barbers/${barberId}`);
        setBarbers(barberResponse.data);
        const districtResponse = await API.get('/address/districts');
        setDistricts(districtResponse.data);
        setBarberName(barberResponse.data.barberName); // İsim alanını doldur
      } catch (error) {
        console.error(
          'Fetch Data Error: ',
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [token, barberId]);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileRef = ref(storage, `barber_photos/${file.name}`);
      await uploadBytes(fileRef, file); // Fotoğrafı Firebase Depolama'ya yükle
      const photoURL = await getDownloadURL(fileRef); // Yüklenen fotoğrafın URL'sini al
      console.log("Photo URL:", photoURL);
      
      // Yeni URL'yi veritabanına kaydet
      await API.put(`/barbers/${barberId}/photo`, photoURL);
      setBarbers(prev => ({ ...prev, photoUrl: photoURL }));
      setSuccessMessagePhoto('Fotoğraf başarıyla güncellendi!');
      setErrorMessagePhoto('');
    } catch (error) {
      console.error('Fotoğraf güncelleme hatası:', error);
      setErrorMessagePhoto('Fotoğraf güncellenirken bir hata oluştu');
      setSuccessMessagePhoto('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updateData = {
      email,
      password,
    };

    try {
      await API.put(`/barbers/${barberId}`, updateData);
      setSuccessMessageEmail('Email ve şifre başarıyla güncellendi!');
      setErrorMessageEmail('');
    } catch (error) {
      setErrorMessageEmail('Beklenmeyen bir hata oluştu');
      setSuccessMessageEmail('');
    }
  };

  const handleSubmitAddress = async (event) => {
    event.preventDefault();
    const updateAddressData = {
      fullAddress: address,
      barberId,
      districtId
    };
    try {
      await API.put(`/addressesInfo/update/${barberId}`, updateAddressData);
      setSuccessMessageAddress('Adres başarıyla güncellendi!');
      setErrorMessageAddress('');
    } catch (error) {
      setErrorMessageAddress('Beklenmeyen bir hata oluştu');
      setSuccessMessageAddress('');
    }
  };

  const handleSubmitName = async (event) => {
    event.preventDefault();

    try {
      await API.put(`/barbers/${barberId}/name`, barberName);
      setSuccessMessageName('İsim başarıyla güncellendi!');
      setErrorMessageName('');
    } catch (error) {
      setErrorMessageName('Beklenmeyen bir hata oluştu');
      setSuccessMessageName('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 flex flex-col items-center justify-center bg-gray-50 min-h-screen"
    >
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <div className="flex flex-col items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={barbers.photoUrl}
            alt={barbers.barberName}
            className="w-32 h-32 rounded-full object-cover shadow-lg cursor-pointer"
            onClick={handlePhotoClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
            accept="image/*"
          />
          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold text-gray-800">{barbers.barberName}</p>
            <div className="flex items-center justify-center mt-2">
             
            </div>
            <p className="text-gray-500 mt-2">Adres: {barbers.address}</p>
          </div>
        </div>
        {successMessagePhoto && <p className="mt-4 text-green-600 text-center">{successMessagePhoto}</p>}
        {errorMessagePhoto && <p className="mt-4 text-red-600 text-center">{errorMessagePhoto}</p>}
        
        <div className="mt-8 w-full">
          <h2 className="text-xl font-bold mb-4 text-center">İsim Güncelle</h2>
          <form onSubmit={handleSubmitName} className="space-y-4">
            <div>
              <label htmlFor="barberName" className="block text-sm font-medium text-gray-700">İsim</label>
              <input
                type="text"
                id="barberName"
                value={barberName}
                onChange={(e) => setBarberName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Güncelle
              </button>
            </div>
          </form>
          {successMessageName && <p className="mt-4 text-green-600 text-center">{successMessageName}</p>}
          {errorMessageName && <p className="mt-4 text-red-600 text-center">{errorMessageName}</p>}
        </div>

        <div className="mt-8 w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Email ve Şifre Güncelle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Güncelle
              </button>
            </div>
          </form>
          {successMessageEmail && <p className="mt-4 text-green-600 text-center">{successMessageEmail}</p>}
          {errorMessageEmail && <p className="mt-4 text-red-600 text-center">{errorMessageEmail}</p>}
        </div>

        <div className="mt-8 w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Adres Güncelle</h2>
          <form onSubmit={handleSubmitAddress} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adres</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">İlçe</label>
              <select
                id="district"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="" disabled>İlçe seçiniz</option>
                {districts.map(district => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Güncelle
              </button>
            </div>
          </form>
          {successMessageAddress && <p className="mt-4 text-green-600 text-center">{successMessageAddress}</p>}
          {errorMessageAddress && <p className="mt-4 text-red-600 text-center">{errorMessageAddress}</p>}
        </div>
      </div>
    </motion.div>
  );
}
