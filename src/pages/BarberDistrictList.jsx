import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useLocation, useParams } from "react-router-dom";

const BarberDistrictList = () => {
  const [barbers, setBarbers] = useState([]);
  const { districtId } = useParams();
  const location = useLocation();
  const date = location.state?.date || '';
  const localDateString = date ? new Date(date) : new Date();

  
  console.log("tarih bilgisi",localDateString)

  if (!localDateString) {

    localDateString = new Date();

}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`appointments/${districtId}`);
        console.log("API response data:", response.data); // API yanıtını loglayın
        setBarbers(response.data);
      } catch (error) {
        console.error('Fetch Data Error:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, [districtId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Barbers</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {barbers.map((barber) => (
            <div key={barber.id} className="group relative">
              <Link to={`/barber/${barber.id}`} state={{ date: localDateString }} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={barber.photoUrl}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    alt={`Photo of ${barber.barberName}`}
                  />
                </div>
              </Link>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/barber/${barber.id}`} state={{ date: localDateString }}
                      className="underline hover:text-gray-900 focus:text-gray-400"
                    >
                      {barber.barberName}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">{barber.barberAddress}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {renderStars(Math.round(barber.rate))}
                    <span style={{ marginLeft: "8px" }}>Yorumlar</span>
                    ({barber.commentSize || 0}){" "}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900"></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarberDistrictList;
