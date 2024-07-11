import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RestaurantFiltersProps {
    applyRestaurantFilters: (params: URLSearchParams) => void;
    restaurantFilters: {
        rating: boolean;
        offers: boolean;
    };
}

const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({ applyRestaurantFilters, restaurantFilters }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating4Plus, setRating4Plus] = useState(false);
    const [offers, setOffers] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setRating4Plus(params.get('rating') === 'true');
        setOffers(params.get('offers') === 'true');
    }, [location.search]);

    const applyRestaurantFiltersAndNavigate = () => {
        let queryParams = '';

        if (rating4Plus) {
            queryParams += 'rating=true&';
        }
        if (offers) {
            queryParams += 'offers=true&';
        }

        queryParams = queryParams.slice(0, -1);
        console.log('Navigating to:', `/restaurants/filter?${queryParams}`);
        navigate(`/restaurants/filter?${queryParams}`);

        applyRestaurantFilters(new URLSearchParams(queryParams));
    };

    const handleRatingClick = () => {
        const newValue = !rating4Plus;
        setRating4Plus(newValue);
    };

    const handleOffersClick = () => {
        const newValue = !offers;
        setOffers(newValue);
    };

    return (
        <div className="bg-white p-4 text-black ml-5">
            <div className="flex items-center space-x-4">
                <button
                    className={`px-4 py-2 rounded-md border ${rating4Plus ? 'bg-gray-300 text-black' : 'bg-white text-black'
                        } border-gray-300 shadow-md`}
                    onClick={handleRatingClick}
                >
                    Rating: 4.0+
                </button>
                <button
                    className={`px-4 py-2 rounded-md border ${offers ? 'bg-gray-300 text-black' : 'bg-white text-black'
                        } border-gray-300 shadow-md`}
                    onClick={handleOffersClick}
                >
                    Offers
                </button>
                <button
                    className="px-4 py-2 rounded-md bg-blue-500 text-white"
                    onClick={applyRestaurantFiltersAndNavigate}
                >
                    Apply Restaurant Filters
                </button>
            </div>
        </div>
    );
};

export default RestaurantFilters;