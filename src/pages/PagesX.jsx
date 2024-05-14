import React, { useEffect, useState } from 'react'
import API from '../api/axios';
import { useParams } from 'react-router-dom';


export default function PagesX() {

    const {barberId} = useParams(); 

    const [barbers, setBarbers] = useState([]);
    const [servicesInfo, setServicesInfo] = useState([]);
    const [availableHours, setAvailableHours] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const barberResponse = await API.get(`/barbers/${barberId}`);
          setBarbers(barberResponse.data);
          
          const servicesResponse = await API.get(`/servicesInfo/barber/${barberId}`);
          setServicesInfo(servicesResponse.data);
  
          const availableResponse = await API.get(`/appointments/available/${barberId}`);
          setAvailableHours(availableResponse.data);
        } catch (error) {
          console.error("Fetch Data Error: ", error.response ? error.response.data : error.message);
        }
      };
      fetchData();
    }, [barberId]);
  
    const [workHours, setWorkHours] = useState([]);
  
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


  return (
    <div className="font-sans">
    <div className="container mx-auto py-8">
      <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10 ">
        <div className="w-full lg:h-72 mt-0 top-0 text-center">
          <h2 className="text-left font-bold text-gray-800 mt-4">{barbers.barberName}</h2>
          <img src={barbers.photoUrl} width="200" height="200" alt="Product" className="lg:w-10/12 w-full h-full rounded-xl object-cover object-top" />
          <div className="flex flex-wrap gap-4 mr-left">
            <button type="button" className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center">
              <svg className="w-3 mr-1" fill="currentColor" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
              </svg>
              {barbers.rate}
            </button>
            <button type="button" className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 mr-1" fill="currentColor" viewBox="0 0 32 32">
                <path d="M14.236 21.954h-3.6c-.91 0-1.65-.74-1.65-1.65v-7.201c0-.91.74-1.65 1.65-1.65h3.6a.75.75 0 0 1 .75.75v9.001a.75.75 0 0 1-.75.75zm-3.6-9.001a.15.15 0 0 0-.15.15v7.2a.15.15 0 0 0 .15.151h2.85v-7.501z" data-original="#000000" />
                <path d="M20.52 21.954h-6.284a.75.75 0 0 1-.75-.75v-9.001c0-.257.132-.495.348-.633.017-.011 1.717-1.118 2.037-3.25.18-1.184 1.118-2.089 2.28-2.201a2.557 2.557 0 0 1 2.17.868c.489.56.71 1.305.609 2.042a9.468 9.468 0 0 1-.678 2.424h.943a2.56 2.56 0 0 1 1.918.862c.483.547.708 1.279.617 2.006l-.675 5.401a2.565 2.565 0 0 1-2.535 2.232zm-5.534-1.5h5.533a1.06 1.06 0 0 0 1.048-.922l.675-5.397a1.046 1.046 0 0 0-1.047-1.182h-2.16a.751.751 0 0 1-.648-1.13 8.147 8.147 0 0 0 1.057-3 1.059 1.059 0 0 0-.254-.852 1.057 1.057 0 0 0-.795-.365c-.577.052-.964.435-1.04.938-.326 2.163-1.71 3.507-2.369 4.036v7.874z" data-original="#000000" />
                <path d="M4 31.75a.75.75 0 0 1-.612-1.184c1.014-1.428 1.643-2.999 1.869-4.667.032-.241.055-.485.07-.719A14.701 14.701 0 0 1 1.25 15C1.25 6.867 7.867.25 16 .25S30.75 6.867 30.75 15 24.133 29.75 16 29.75a14.57 14.57 0 0 1-5.594-1.101c-2.179 2.045-4.61 2.81-6.281 3.09A.774.774 0 0 1 4 31.75zm12-30C8.694 1.75 2.75 7.694 2.75 15c0 3.52 1.375 6.845 3.872 9.362a.75.75 0 0 1 .217.55c-.01.373-.042.78-.095 1.186A11.715 11.715 0 0 1 5.58 29.83a10.387 10.387 0 0 0 3.898-2.37l.231-.23a.75.75 0 0 1 .84-.153A13.072 13.072 0 0 0 16 28.25c7.306 0 13.25-5.944 13.25-13.25S23.306 1.75 16 1.75z" data-original="#000000" />
              </svg>
              {barbers.commentSize}
            </button>
          </div>
          <div className="ml-left">
            <p className="mr-0">{barbers.address}</p>
          </div>
        </div>

        <div className="ml-auto">
          <div className="flex flex-wrap items-start gap-0">
            <div className="ml-left gap-4">
              <h2 className="text-2xl font-extrabold text-gray-800">Adjective Attire | T-shirt</h2>
              <p className="text-sm text-gray-400 mt-2">Well-Versed Commerce</p>
            </div>
            <div className="flex flex-wrap gap-4 ml-auto">
              <button type="button" className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12px" fill="currentColor" className="mr-1" viewBox="0 0 64 64">
                  <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z" data-original="#000000"></path>
                </svg>
                100
              </button>
              <button type="button" className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12px" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M453.332 85.332c0 38.293-31.039 69.336-69.332 69.336s-69.332-31.043-69.332-69.336C314.668 47.043 345.707 16 384 16s69.332 31.043 69.332 69.332zm0 0" data-original="#000000" />
                  <path d="M384 170.668c-47.063 0-85.332-38.273-85.332-85.336C298.668 38.273 336.938 0 384 0s85.332 38.273 85.332 85.336c0 47.063-38.27 85.336-85.332 85.336zM384 32c-29.418 0-53.332 23.938-53.332 53.332 0 29.398 23.914 53.336 53.332 53.336s53.332-23.938 53.332-53.336C437.332 55.938 413.418 32 384 32zm69.332 394.668C453.332 464.957 422.293 496 384 496s-69.332-31.043-69.332-69.332c0-38.293 31.039-69.336 69.332-69.336s69.332 31.043 69.332 69.336zm0 0" data-original="#000000" />
                  <path d="M384 512c-47.063 0-85.332-38.273-85.332-85.332 0-47.063 38.27-85.336 85.332-85.336s85.332 38.273 85.332 85.336c0 47.059-38.27 85.332-85.332 85.332zm0-138.668c-29.418 0-53.332 23.938-53.332 53.336C330.668 456.063 354.582 480 384 480s53.332-23.937 53.332-53.332c0-29.398-23.914-53.336-53.332-53.336zm0 0" data-original="#000000" />
                  <path d="M170.668 426.668C123.605 426.668 85.332 388.395 85.332 341.332c0-47.059 38.273-85.332 85.336-85.332s85.332 38.273 85.332 85.332c0 47.063-38.27 85.336-85.332 85.336zm0-138.668c-29.418 0-53.332 23.938-53.332 53.336 0 29.398 23.914 53.332 53.332 53.332s53.332-23.934 53.332-53.332c0-29.398-23.914-53.336-53.332-53.336zm0 0M512 341.332c0 75.191-61.141 136.332-136.332 136.332S239.336 416.523 239.336 341.332 300.477 205 375.668 205s136.332 61.141 136.332 136.332zm0 0" data-original="#000000" />
                  <path d="M375.668 341.332c0 29.398-23.934 53.332-53.332 53.332s-53.332-23.934-53.332-53.332c0-29.402 23.934-53.336 53.332-53.336s53.332 23.934 53.332 53.336zm0 0" data-original="#000000" />
                </svg>
                200
              </button>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Hizmetler Tablosu</h3>
            <table class="w-full mt-4">
              <thead>
                <tr>
                  <th class="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Hizmet Adı</th>
                  <th class="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Zaman (Dakika)</th>
                  <th class="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {servicesInfo.map((service, index) => (
                  <tr key={index}>
                    <td class="py-2 px-4 border border-gray-200">{service.serviceName}</td>
                    <td class="py-2 px-4 border border-gray-200">{service.price}</td>
                    <td class="py-2 px-4 border border-gray-200">{service.time}</td>
                    <td><button type="button" class="w-12 h-12 border-2 bg-sky-200 hover:bg-sky-900 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">Ekle</button></td>
                    <td><button type="button" class="w-12 h-12 border-2 bg-red-700 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0">Çıkar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>



          <div className="ml-left">
            <h3 className="text-lg font-bold text-gray-800">Çalışma Saatleri</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {workHours.map((hourData, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-12 h-12 border-2 hover:border-gray-800 font-semibold text-sm rounded-full flex items-center justify-center shrink-0 ${hourData.color}`}
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
  )
}
