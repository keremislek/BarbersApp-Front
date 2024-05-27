import { Card, Typography, Avatar } from '@material-tailwind/react';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

// Rate'i yıldızlarla gösteren yardımcı fonksiyon
const renderStars = (rate) => {
    const starCount = Math.round(rate); // Rate'i yuvarla
    const stars = [];

    // Yıldızları oluştur
    for (let i = 0; i < 5; i++) {
        if (i < starCount) {
            stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Dolu yıldız
        } else {
            stars.push(<span key={i} className="text-gray-300">&#9734;</span>); // Boş yıldız
        }
    }

    return stars;
};

export default function BarberDateList() {
    const location = useLocation();
    const { barbers } = location.state || { barbers: [] };
    const { localDateString } = useParams();


    console.log('Tarih bilgisi', localDateString);
    

    if (!barbers.length) {
        return <div>No barber data available.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((barber) => (
                <div key={barber.id}>
                    <Link to={`/barber/${barber.id}`} state={{ date: localDateString }}>
                            Barber Details

                        <Card className="p-4 flex flex-col items-center justify-between w-full transition duration-300 ease-in-out transform hover:shadow-lg hover:scale-105 bg-white dark:bg-gray-800 rounded-xl">
                            <Avatar
                                src={barber.photoUrl || 'https://via.placeholder.com/150'}
                                alt={barber.barberName}
                                size="md"
                                className="w-40 h-40 mb-4"
                            />
                            <div className="flex flex-col items-center justify-center w-full">
                                <Typography variant="h6" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{barber.barberName || 'Unnamed Barber'}</Typography>
                                <Typography variant="body2" className="text-gray-500 dark:text-gray-300 mb-2">{barber.address || 'Unknown Address'}</Typography>
                                <div className="flex items-center">
                                    <Typography variant="body2" className="text-gray-700 dark:text-gray-400 mr-2">Rate: {renderStars(barber.rate)}</Typography>
                                    <Typography variant="body2" className="text-gray-700 dark:text-gray-400">Comments: {barber.commentSize || 'No comments'}</Typography>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            ))}
        </div>
    );
}
