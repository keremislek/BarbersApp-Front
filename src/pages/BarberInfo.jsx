import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { motion } from 'framer-motion';

export default function BarberInfo() {
  const [barbers, setBarbers] = useState({});
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
      } catch (error) {
        console.error(
          'Fetch Data Error: ',
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [token, barberId]);

  const handleDelete = async () => {
    try {
      // Implement the API request for deleting barber information
      console.log('Barber information deleted successfully.');
    } catch (error) {
      console.error('Error deleting barber information: ', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 flex items-center justify-center"
    >
      <div className="flex flex-row items-start justify-center w-full gap-8">
        {/* Left Section - Photo, Stars, Comments */}
        <div className="flex flex-col items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={barbers.photoUrl}
            alt={barbers.barberName}
            className="w-64 h-64 rounded-full object-cover shadow-md"
          />
          <div className="flex items-center mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1a.75.75 0 0 1 .673.418l1.891 3.815 4.226.616a.75.75 0 0 1 .416 1.279l-3.059 2.981.722 4.211a.75.75 0 0 1-1.088.791L10 14.697l-3.785 1.986a.75.75 0 0 1-1.088-.79l.722-4.211-3.059-2.981a.75.75 0 0 1 .416-1.279l4.226-.616 1.891-3.815A.75.75 0 0 1 10 1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg">{barbers.rate}</p>
            <p className="text-gray-500 ml-2">{barbers.commentSize} yorum</p>
          </div>
        </div>

        {/* Right Section - Address and Others */}
        <div className="flex flex-col items-start w-1/2">
          <p className="text-3xl font-bold text-gray-800">{barbers.barberName}</p>
          <p className="text-gray-500 mt-2">Adres: {barbers.address}</p>
          {/* Other Information Can Go Here */}
        </div>
      </div>

      {/* Update Button */}
      <div>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 mt-8 rounded-md"
        >
          Bilgileri Güncelle
        </button>
      </div>
    </motion.div>
  );
}
