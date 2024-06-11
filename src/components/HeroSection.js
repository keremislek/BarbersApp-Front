import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';

export default function HeroSection() {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get('/address/districts');
                setDistricts(response.data);
            } catch (error) {
                console.error('Fetch Data Error:', error.response ? error.response.data : error.message);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            debouncedSearch(searchTerm);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSearch = async (term) => {
        if (term.trim() === '') {
            setSearchResults([]);
            return;
        }
        try {
            const response = await API.get('/barbers/search', {
                params: { name: term }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search Error:', error.response ? error.response.data : error.message);
        }
    };

    const handleSearchDate = async () => {
        const today = new Date().setHours(0, 0, 0, 0);
        if (selectedDate.setHours(0, 0, 0, 0) < today) {
            setShowPopup(true);
            return;
        }

        try {
            if (!(selectedDate instanceof Date)) {
                console.error('Selected date is not a valid Date object.');
                return;
            }

            const localDateString = format(selectedDate, 'yyyy-MM-dd');

            const dateResponse = await API.get('/appointments/date', {
                params: { date: localDateString }
            });
            console.log(dateResponse.data);
            navigate(`/barber/date/${localDateString}`, { state: { barbers: dateResponse.data } });
        } catch (error) {
            console.error('Error fetching available times:', error);
        }
    };

    const debouncedSearch = debounce((term) => {
        handleSearch(term);
    }, 300); // 300ms debounce delay

    const handleDistrictSelection = (districtId) => {
        setSelectedDistrict(districtId);
        navigate(`/district/${districtId}`);
    };

    const handleClickBarber = (barberId) => {
        navigate(`/barber/${barberId}`, { state: { date: selectedDate } });
    }

    const handleDateChange = date => {
        setSelectedDate(date);
        console.log(selectedDate);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    var settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 5000,
        cssEase: "linear"
    };

    return (
        <div className="relative h-[550px] w-full">
            <Slider {...settings}>
                <div>
                    <img className="w-full h-[500px] object-cover" src="https://heygoldie.com/blog/wp-content/uploads/2021/12/barber-shop-decor-ideas.jpg.webp" alt="Barber Shop 1" />
                </div>
                <div>
                    <img className='w-full h-[500px] object-cover' src='https://images.squarespace-cdn.com/content/v1/5fd787d32a8a4a2604b22b5d/ceb58746-5e96-448a-8cf2-4c2e8609973b/msbsnomask-54578-2.jpg?format=750w' alt="Barber Shop 2" />
                </div>
            </Slider>

            <div className='container flex justify-between items-center absolute top-0 left-1/2 transform -translate-x-1/2 h-full z-20'>
                <div className="flex flex-col gap-y-8 absolute top-40 left-10">
                    <img src='https://cdn.logojoy.com/wp-content/uploads/2018/05/30161127/651.png' className="h-32 w-32" alt="logo" />
                    <h3 className='text-white font-extrabold text-sm leading-tight'>Yakışıklanmak için <br />Bizi Seçin</h3>
                </div>
                <div className='flex flex-col items-center absolute top-9 left-1/2 transform -translate-x-1/2 w-full max-w-md'>
                    <div className='flex items-center w-full'>
                        <input
                            type="text"
                            placeholder="Berber ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 px-4 border-2 border-gray-200 rounded-lg mr-2 transition-colors hover:border-purple-500 outline-none w-full"
                        />
                        <div className="relative w-48">
                            <select
                                className="h-10 px-4 border-2 border-gray-200 rounded-lg transition-colors hover:border-purple-500 outline-none w-full"
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictSelection(e.target.value)}
                            >
                                <option value="">İlçe Seçiniz</option>
                                {districts.map((district, index) =>
                                    <option key={index} value={district.id}>{district.name}</option>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-6 h-6 text-gray-400"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.293 14.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 1.414-1.414L8 14.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {searchTerm.trim() !== '' && (
                        <div className="flex w-full mt-2">
                            <div className="bg-white rounded-lg shadow-lg p-4 w-full">
                                <h3 className="text-sm font-bold mb-2">Arama Sonuçları:</h3>
                                <ul className="text-sm">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((barber) => (
                                            <li key={barber.id} className="border-b last:border-0 py-2 cursor-pointer hover:text-blue-500" onClick={() => handleClickBarber(barber.id)}>
                                                {barber.barberName}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 py-2">Sonuç bulunamadı.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className='mx-auto bg-slate-200 absolute top-16 right-1'>
                    <div className="mx-auto max-w-md p-4 flex flex-col items-center">
                        <h1 className="text-xl font-bold mb-4">Randevu Tarihi Seçin</h1>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="rounded-lg shadow-md"
                        />
                        <div className="flex items-center mt-4">
                            <p className="text-black mr-4">Seçilen Tarih: {selectedDate.toLocaleDateString()}</p>
                            <button
                                onClick={handleSearchDate}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                            >
                                Ara
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-medium text-gray-800">Geçmiş bir tarihle arama yapılamaz.</p>
                        <button
                            onClick={handleClosePopup}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
