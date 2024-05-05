import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const BarberDetails = () => {
  const { id } = useParams();
  const [barberDetails, setBarberDetails] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchBarberDetails = async () => {
      try {
        const response = await API.get(`/barbers/${id}`);
        console.log('Barber Details:', response.data);
        setBarberDetails(response.data);
      } catch (error) {
        console.error(
          'Fetch Barber Details Error:',
          error.response ? error.response.data : error.message
        );
      }
    };

    const fetchBarberServiceDetails = async () => {
      try {
        const response = await API.get(`/servicesInfo/barber/${id}`);
        console.log('Services Details:', response.data);
        setServiceDetails(response.data);
      } catch (error) {
        console.error(
          'Service Details Fetch Error:',
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchBarberDetails();
    fetchBarberServiceDetails();
  }, [id]);

  const toggleServiceDetails = () => {
    setShowServiceDetails(!showServiceDetails);
  };

  const handleClose = () => {
    setShowServiceDetails(false);
  };

  const handleAddService = (service) => {
    setSelectedServices([...selectedServices, service]);
    setTotalTime(totalTime + service.time);
    setTotalPrice(totalPrice + service.price);
  };

  const handleRemoveService = (serviceId) => {
    const removedService = selectedServices.find(service => service.id === serviceId);
    if (removedService) {
      setTotalTime(totalTime - removedService.time);
      setTotalPrice(totalPrice - removedService.price);
      setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
    }
  };

  const renderWorkingHours = () => {
    const hours = [];
    for (let i = 9; i <= 21; i++) {
      hours.push(
        <button key={i} onClick={() => console.log(`Hour selected: ${i}:00`)}>{`${i}:00`}</button>
      );
    }
    return hours;
  };

  return (
    <div className="container">
      <div className="container-left">
        {barberDetails ? (
          <div>
            <h2>{barberDetails.barberName}</h2>
            <p>Address: {barberDetails.address}</p>
            <div className="working-hours">
              <h3>Working Hours</h3>
              {renderWorkingHours()}
            </div>
          </div>
        ) : (
          <p>Loading Barber Details...</p>
        )}
      </div>
      <div className="container-right">
        <div className="barber-photo-container">
          {barberDetails && <img src={barberDetails.photoUrl} alt="Barber" className="barber-photo" />}
        </div>
        <div className="services-table">
          <h2>Services and Hours</h2>
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Time</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {serviceDetails ? (
                serviceDetails.map((service) => (
                  <tr key={service.id}>
                    <td>{service.serviceName}</td>
                    <td>{service.time}</td>
                    <td>{service.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Loading Service Details...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="selected-services-container">
          <div className="selected-services">
            <h2>Selected Services</h2>
            <ul>
              {selectedServices.map((service) => (
                <li key={service.id}>
                  <p>Service Name: {service.serviceName}</p>
                  <p>Time: {service.time}</p>
                  <p>Price: {service.price}</p>
                  <button onClick={() => handleRemoveService(service.id)}>-</button>
                </li>
              ))}
            </ul>
            <div className="total-info">
              <p>Total Time: {totalTime}</p>
              <p>Total Price: {totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDetails;
