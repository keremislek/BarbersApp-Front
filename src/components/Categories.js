import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const Categories = () => {
  const [barbers, setBarbers] = useState([]);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/barbers');
        const barbersWithRatings = response.data.map(barber => ({
          ...barber,
          rating: ratings[barber.id] || 0
        }));
        const sortedBarbers = barbersWithRatings.sort((a, b) => b.rating - a.rating);
        setBarbers(sortedBarbers.slice(0, 5)); // Sadece ilk 5 berberi göster
      } catch (error) {
        console.error('Fetch Data Error:', error.response ? error.response.data : error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await API.get("/comments");
        const commentCounts = {};
        response.data.forEach((comment) => {
          if (comment.barberId in commentCounts) {
            commentCounts[comment.barberId]++;
          } else {
            commentCounts[comment.barberId] = 1;
          }
        });
        setComments(commentCounts);
      } catch (error) {
        console.error(
          "Fetch Comments Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await API.get("/ratings");
        const ratingSums = {};
        const ratingCounts = {};
        response.data.forEach((rating) => {
          if (rating.barberId in ratingSums) {
            ratingSums[rating.barberId] += rating.rate;
            ratingCounts[rating.barberId]++;
          } else {
            ratingSums[rating.barberId] = rating.rate;
            ratingCounts[rating.barberId] = 1;
          }
        });
        const averageRatings = {};
        for (const barberId in ratingSums) {
          averageRatings[barberId] = ratingSums[barberId] / ratingCounts[barberId];
        }
        setRatings(averageRatings);
      } catch (error) {
        console.error(
          "Fetch Ratings Error:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
    fetchComments();
    fetchRatings();
  }, []);

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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Popüler Berberler</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {barbers.map((barber) => (
            <div key={barber.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={barber.photoUrl}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link
                      to={`/barber/${barber.id}`}
                      className="underline hover:text-gray-900 focus:text-gray-400"
                    >
                      {barber.barberName}
                    </Link>{" "}
                    
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{barber.address}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    
                    {renderStars(Math.round(barber.rating))}
                     <span style={{ marginLeft: "8px" }}>Yorumlar</span>
                      ({comments[barber.id] || 0}){" "}
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

export default Categories;
