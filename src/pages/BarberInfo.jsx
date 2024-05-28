import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';

export default function BarberInfo() {
  const [barbers, setBarbers] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [districts, setDistricts] = useState([]);
  const [successMessageEmail, setSuccessMessageEmail] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [successMessageAddress, setSuccessMessageAddress] = useState('');
  const [errorMessageAddress, setErrorMessageAddress] = useState('');

  const barberId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

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
      } catch (error) {
        console.error(
          'Fetch Data Error: ',
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [token, barberId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updateData = {
      email,
      password,
    };

    try {
      await API.put(`/barbers/${barberId}`, updateData);
      setSuccessMessageEmail('Email and password updated successfully!');
      setErrorMessageEmail('');
    } catch (error) {
      setErrorMessageEmail('Failed to update email and password.');
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
      setSuccessMessageAddress('Address updated successfully!');
      setErrorMessageAddress('');
    } catch (error) {
      setErrorMessageAddress('Failed to update address.');
      setSuccessMessageAddress('');
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
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold text-gray-800">{barbers.barberName}</p>
            <div className="flex items-center justify-center mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a.75.75 0 0 1 .673.418l1.891 3.815 4.226.616a.75.75 0 0 1 .416 1.279l-3.059 2.981.722 4.211a.75.75 0 0 1-1.088.791L10 14.697l-3.785 1.986a.75.75 0 0 1-1.088-.79l.722-4.211-3.059-2.981a.75.75 0 0 1 .416-1.279l4.226-.616 1.891-3.815A.75.75 0 0 1 10 1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-lg font-medium">{barbers.rate}</p>
              <p className="text-gray-500 ml-2">({barbers.commentSize} yorum)</p>
            </div>
            <p className="text-gray-500 mt-2">Adres: {barbers.address}</p>
          </div>
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
                Update
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
                <option value="" disabled selected>İlçe seçiniz</option>
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
                Update
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
