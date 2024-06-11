import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import API from '../api/axios';
import { format } from 'date-fns';
import { SlBasket } from "react-icons/sl";

const CommentModal = ({ comments, onClose, barberId }) => {
  const [newComment, setNewComment] = useState('');
  const customId = localStorage.getItem('id');

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      await API.post('/comments', {
        customerId: customId,
        barberId: barberId,
        text: newComment
      });

      onClose();
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error('Yorum silinirken bir hata oluştu:', error);
    }
  };
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Yorumlar</h3>
                <div className=" px-2 py-0 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button onClick={onClose} type="button" className="relative top-0 right-0 -mr-3 -mt-3 w-8 h-8 inline-flex justify-center rounded-full bg-white border border-gray-300 shadow-sm px-0.5 py-0.5 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  {comments.map((comment, index) => (
                    <div key={index} className="border-b border-gray-200 mb-4 pb-4">
                      {comment.customerId === customId && (
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                          className="text-sm text-green-500 hover:text-green-700"
                        >
                          Sil
                        </button>
                      )}
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">Müşteri:</span> {comment.customerName.toUpperCase().substring(0, 2)}{comment.customerName.toUpperCase().substring(0, 2).replace(/./g, '*')}
                        {comment.customerId === customId && (
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-sm text-green-500 hover:text-green-700"
                          >
                            Sil
                          </button>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">Yorum:</span> {comment.text}
                        {comment.customerId === customId && (
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Sil
                          </button>
                        )}
                      </p>
                      {comment.customerId === customId && (
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    className="w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    rows="3"
                    placeholder="Yorumunuzu buraya yazın..."
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-2 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm"
                  >
                    Yorum Ekle
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const BarberDetails = () => {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { barberId } = useParams();

  const [barbers, setBarbers] = useState([]);
  const [servicesInfo, setServicesInfo] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [comments, setComments] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const location = useLocation();
  const date = location.state?.date || '';
  const localDateString = new Date(date);

  if (!localDateString) {
    localDateString = new Date();
  }

  const [formData, setFormData] = useState({
    serviceIds: [],
    availableHours: Array(12)
      .fill()
      .map((_, index) =>
        availableHours[`t${index + 1}`] === 'T' ? 'T' : 'F'
      ),
    date: localDateString,
    userId: null,
  });

  const handleAddToCart = (service) => {
    if (!cart.find((item) => item.id === service.id)) {
      setCart((prevCart) => [...prevCart, service]);
      setFormData((prevState) => ({
        ...prevState,
        serviceIds: [...prevState.serviceIds, service.id],
      }));
    }
  };

  const handleRemoveFromCart = (serviceId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== serviceId));
    setFormData((prevState) => ({
      ...prevState,
      serviceIds: prevState.serviceIds.filter((id) => id !== serviceId),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = localDateString.toISOString().split('T')[0];

        const barberResponse = await API.get(`/barbers/${barberId}`);
        setBarbers(barberResponse.data);

        const servicesResponse = await API.get(`/servicesInfo/barber/${barberId}`);
        setServicesInfo(servicesResponse.data);

        const availableResponse = await API.get(
          `/appointments/available/${barberId}`,
          { params: { date: formattedDate } }
        );
        setAvailableHours(availableResponse.data);

        const commentResponse = await API.get(`/comments/barber/${barberId}`);
        setComments(commentResponse.data);
      } catch (error) {
        console.error(
          'Fetch Data Error: ',
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchData();
  }, [barberId]);

  const [workHours, setWorkHours] = useState([]);

  useEffect(() => {
    const hours = Array(12)
      .fill()
      .map((_, index) => {
        const key = `t${index + 1}`;
        const value = availableHours[key];
        let color;

        if (value === 'T') {
          color = 'bg-red-600 pointer-events-none opacity-50';
        } else if (value === 'P') {
          color = 'bg-yellow-600 pointer-events-none opacity-50';
        } else {
          color = 'bg-blue-500 hover:bg-blue-900';
        }

        return {
          hour: (9 + index) % 24,
          disabled: value === 'T' || value === 'B',
          color: color,
        };
      });
    setWorkHours(hours);
  }, [availableHours]);

  useEffect(() => {
    const hours = Array(12)
      .fill()
      .map((_, index) =>
        availableHours[`t${index + 1}`] === 'T' ? 'T' : 'F'
      );
    setFormData((prevFormData) => ({
      ...prevFormData,
      availableHours: hours,
    }));
  }, [availableHours]);

  const handleHourClick = (hour) => {
    const updatedHours = workHours.map((hourData) => {
      if (hourData.hour === hour) {
        return { ...hourData, color: 'bg-blue-900' };
      }
      return hourData;
    });

    setWorkHours(updatedHours);

    setFormData((prevFormData) => ({
      ...prevFormData,
      availableHours: prevFormData.availableHours.map((value, index) => {
        const hourIndex = (9 + index) % 24;
        return hourIndex === hour ? 'B' : availableHours[`t${index + 1}`];
      }),
    }));
  };



  const handleConfirmAndContinue = async () => {
    try {
      const userId = localStorage.getItem('id');

      const requestData = {
        barberId: barberId,
        date: formData.date,
        serviceIds: formData.serviceIds,
        userId: userId,
        t1: formData.availableHours[0],
        t2: formData.availableHours[1],
        t3: formData.availableHours[2],
        t4: formData.availableHours[3],
        t5: formData.availableHours[4],
        t6: formData.availableHours[5],
        t7: formData.availableHours[6],
        t8: formData.availableHours[7],
        t9: formData.availableHours[8],
        t10: formData.availableHours[9],
        t11: formData.availableHours[10],
        t12: formData.availableHours[11],
      };

      await API.post('/appointments/createOrUpdate', requestData);

      alert('Randevu isteği berbere gönderildi');

      setCart([]);
      setIsCartOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(
        'Confirm and Continue Error: ',
        error.response ? error.response.data : error.message
      );
      alert('Randevu oluşturulurken bir hata oluştu.');
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleStarClick = async (rate) => {
    if (isRated) return;

    try {
      await API.post('/ratings/create', {
        rate: rate,
        customerId: localStorage.getItem('id'),
        barberId: barberId,
      });
      setRating(rate);
      setIsRated(true);
    } catch (error) {
      console.error(
        'Rating Error: ',
        error.response ? error.response.data : error.message
      );
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const clickable = !isRated;
      stars.push(
        <span
          key={i}
          className={`text-2xl cursor-pointer ${clickable
            ? 'text-yellow-500 hover:text-yellow-600'
            : 'text-gray-400'
            }`}
          onClick={() => clickable && handleStarClick(i)}
        >
          {rating >= i ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    console.log('availableHours:', formData.availableHours);
  }, [formData.availableHours]);

  const totalCartPrice = cart.reduce((total, item) => total + item.price, 0);
  const selectedHour = workHours.find((hour) => hour.color === 'bg-blue-900')?.hour;

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="w-full lg:h-72 mt-0 top-0 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">{barbers.barberName}</h2>
            <img
              src={barbers.photoUrl}
              width="200"
              height="200"
              alt="Product"
              className="lg:w-10/12 w-full h-full rounded-xl object-cover object-top mx-auto"
            />
            <div className="text-center mt-4">
              <p className="text-gray-700">
                <span className="font-bold">Adres:</span> {barbers.address}
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <button
                type="button"
                className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center"
              >
                <svg
                  className="w-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 14 13"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                {barbers.rate ? barbers.rate.toFixed(1) : 'N/A'}
              </button>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-gray-600">Puanınızı Verin:</p>
                  {renderStars()}
                </div>
              </div>
              <button
                type="button"
                className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center"
                onClick={openModal}
              >
                Yorumları Gör
              </button>
              {showModal && (
                <CommentModal comments={comments} onClose={closeModal} barberId={barberId} />
              )}
            </div>
          </div>

          <div className="ml-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Berber Sayfası</h2>
                <p className="text-sm text-gray-400">en iyi berberler hizmetinizde</p>
              </div>
              <div className="ml-auto">
                <div className="relative">
                  <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12px"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M453.332 85.332c0 38.293-31.039 69.336-69.332 69.336s-69.332-31.043-69.332-69.336C314.668 47.043 345.707 16 384 16s69.332 31.043 69.332 69.332zm0 0"
                        data-original="#000000"
                      />
                      <path
                        d="M384 170.668c-47.063 0-85.332-38.273-85.332-85.336C298.668 38.273 336.938 0 384 0s85.332 38.273 85.332 85.336c0 47.063-38.27 85.336-85.332 85.336zM384 32c-29.418 0-53.332 23.938-53.332 53.332 0 29.398 23.914 53.336 53.332 53.336s53.332-23.938 53.332-53.336C437.332 55.938 413.418 32 384 32zm69.332 394.668C453.332 464.957 422.293 496 384 496s-69.332-31.043-69.332-69.332c0-38.293 31.039-69.336 69.332-69.336s69.332 31.043 69.332 69.336zm0 0"
                        data-original="#000000"
                      />
                      <path
                        d="M384 512c-47.063 0-85.332-38.273-85.332-85.332 0-47.063 38.27-85.336 85.332-85.336s85.332 38.273 85.332 85.336c0 47.059-38.27 85.332-85.332 85.332zm0-138.668c-29.418 0-53.332 23.938-53.332 53.336C330.668 456.063 354.582 480 384 480s53.332-23.937 53.332-53.332c0-29.398-23.914-53.336-53.332-53.336zm0 0M512 341.332c0 75.191-61.141 136.332-136.332 136.332S239.336 416.523 239.336 341.332 300.477 205 375.668 205s136.332 61.141 136.332 136.332zm0 0"
                        data-original="#000000"
                      />
                      <path
                        d="M375.668 341.332c0 29.398-23.934 53.332-53.332 53.332s-53.332-23.934-53.332-53.332c0-29.402 23.934-53.336 53.332-53.336s53.332 23.934 53.332 53.336zm0 0"
                      />
                    </svg>
                    {cart.length > 0 && ` (${cart.length})`}
                  </button>
                  {isCartOpen && (
                    <div className="relative mt-4 p-4 border border-gray-200 bg-white rounded shadow">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 px-4 border border-gray-200">
                              Hizmet Adı
                            </th>
                            <th className="py-2 px-4 border border-gray-200">
                              Fiyat (TL)
                            </th>
                            <th className="py-2 px-4 border border-gray-200">
                              İşlem
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="py-2 px-4 border border-gray-200">
                                {item.serviceName}
                              </td>
                              <td className="py-2 px-4 border border-gray-200">
                                {item.price} TL
                              </td>
                              <td className="py-2 px-4 border border-gray-200">
                                <button
                                  type="button"
                                  className="w-8 h-8 border-2 bg-red-700 hover:border-gray-800 font-semibold text-xs rounded-md flex items-center justify-center shrink-0 text-white"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  Çıkar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-2 text-right">
                        <p className="text-sm font-bold text-gray-800">
                          Toplam Fiyat: {totalCartPrice} TL
                        </p>
                        {selectedHour && (
                          <p className="text-sm text-gray-600">
                            Seçilen Saat: {selectedHour}:00
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                        onClick={handleConfirmAndContinue}
                      >
                        Onayla ve Devam Et
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Hizmetler Tablosu</h3>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">
                      Hizmet Adı
                    </th>

                    <th className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">
                      Fiyat (TL)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servicesInfo.map((service, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border border-gray-200">
                        {service.serviceName}
                      </td>
                      <td className="py-2 px-4 border border-gray-200">
                        {service.price}
                      </td>

                      <td></td>
                      <td></td>
                      <td>
                        <button
                          type="button"
                          className="w-12 h-12 border-2 bg-sky-200 hover:bg-sky-900 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0"
                          onClick={() => handleAddToCart(service)}
                        >
                          Ekle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <div className="flex items-center mb-4">
                <p className="mb-1">
                  <span className="w-3 h-3 inline-block bg-blue-500 mr-2"></span>{' '}
                  Uygun Saat
                </p>
                <p className="mb-1 ml-4">
                  <span className="w-3 h-3 inline-block bg-yellow-500 mr-2"></span>{' '}
                  Onay Bekliyor
                </p>
                <p className="mb-1 ml-4">
                  <span className="w-3 h-3 inline-block bg-red-500 mr-2"></span>{' '}
                  Bu Saat Dolu
                </p>
              </div>
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
                    {hourData.hour < 10 ? '0' + hourData.hour : hourData.hour}
                    :00
                  </button>
                ))}
              </div>
            </div>
          </div>
          
        </div>
        <div className='w-full flex justify-center items-center'>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48183.75167156163!2d29.078323200000003!3d40.992768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac7f0882bb5db%3A0x8f002035885528db!2sAkasya%20AVM!5e0!3m2!1str!2str!4v1717585197053!5m2!1str!2str" width="700" height="500" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

          </div>
      </div>
    </div>
  );
};

export default BarberDetails;
