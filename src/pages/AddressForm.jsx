import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressForm = ({ barberId, onClose }) => {
  const [fullAddress, setFullAddress] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get('/districts');
        setDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };

    fetchDistricts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      fullAddress,
      barberId,
      districtId: selectedDistrictId,
    };

    try {
      await axios.post('/create', requestData);
      alert('Adres başarıyla oluşturuldu.');
      onClose();
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md">
      <h2 className="text-xl font-bold mb-4">Adres Ekle</h2>
      <div className="mb-4">
        <label>
          Adres:
          <input
            type="text"
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </label>
      </div>
      <div className="mb-4">
        <label>
          İlçe:
          <select
            value={selectedDistrictId}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
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
        </label>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2">
          Kaydet
        </button>
        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
          İptal
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
