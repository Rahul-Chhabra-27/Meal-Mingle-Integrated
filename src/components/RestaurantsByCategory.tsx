import React,{ useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import RestaurantData from '../restaurants.json';
import Menubar from './Menubar';
import { isAuthenticated } from '../utils/authUtils';
import { FaBan } from 'react-icons/fa';

const isRestaurantOpen = (operationDays: string, operationHours: string) => {
    const daysMap: { [key: string]: number } = {
        'Sun': 0,
        'Mon': 1,
        'Tue': 2,
        'Wed': 3,
        'Thu': 4,
        'Fri': 5,
        'Sat': 6
    };

    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

    const [startDay, endDay] = operationDays.split('-');
    const startDayIndex = daysMap[startDay];
    const endDayIndex = daysMap[endDay];

    const withinOperatingDays = startDayIndex <= endDayIndex
        ? currentDay >= startDayIndex && currentDay <= endDayIndex
        : currentDay >= startDayIndex || currentDay <= endDayIndex;

    if (!withinOperatingDays) {
        return false;
    }

    const [startTime, endTime] = operationHours.split('-').map(time => {
        const [hours, minutes] = time.replace('AM', '').replace('PM', '').split(':').map(Number);
        const isPM = time.includes('PM');
        const totalMinutes = (isPM ? hours + 12 : hours) * 60 + minutes;
        return totalMinutes;
    });

    return currentTime >= startTime && currentTime <= endTime;
}

const getOfferPhrase = (minOrderAmt: number, discountPercentage: number) => {
    return `${discountPercentage}% OFF ABOVE ₹${minOrderAmt}`;
};
type categoryNameData = {
    categoryName:string
}
const RestaurantsByCategory = () => {
    const { categoryName } = useParams();
    console.log(categoryName)
    const navigate = useNavigate();
    const [restaurants,setRestaurants] = useState<any[]>([]);

    const fetchCategoryRestaurants = async() => {
        const response = await fetch(`http://localhost:8091/api/restaurants/${categoryName}`);
        const data = await response.json();
        setRestaurants(data.data.restaurants);
        console.log(data)
    }

    useEffect(() => {
        fetchCategoryRestaurants()
    },[categoryName])

    const handleRestaurantClick = (restaurant: any) => {
        if (isAuthenticated()) {
            navigate(`/category/${categoryName}/menu`, { state: { data: restaurant, category: categoryName } });
        } else {
            navigate('/login');
        }
    };

    const filteredRestaurants = RestaurantData.filter(restaurant =>
        restaurant.restaurantItems.some(item => item.restaurantItemCategory === categoryName)
    );

    return (
        <>
            <Navbar />
            <Menubar />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl'>Restaurants Serving {categoryName}</h1>
                {restaurants.length > 0 ? (
                    <div className='grid grid-cols-3 gap-4'>
                        {restaurants.map((restaurant) => {
                            const isOpen = isRestaurantOpen(restaurant.restaurantOperationDays, restaurant.restaurantOperationHours);
                            const offerPhrase = getOfferPhrase(restaurant.restaurantMinimumOrderAmount, restaurant.restaurantDiscountPercentage);
                            return (
                                <div key={restaurant.restaurantId} className="relative max-w-xs rounded-xl overflow-hidden shadow-sm mt-12 cursor-pointer" onClick={() => handleRestaurantClick(restaurant)}>
                                    {isOpen ? (
                                        <img className={`w-full rounded-2xl h-60`} src={`${restaurant.restaurantImageUrl}`} alt="Restaurant Image" />
                                    ) : (
                                        <img className={`w-full rounded-2xl h-60 filter grayscale`} src={`${restaurant.restaurantImageUrl}`} alt="Restaurant Image" />
                                    )}
                                    {restaurant.restaurantDiscountPercentage > 0 && (
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white font-semibold py-1 px-2 rounded-md">
                                            {offerPhrase}
                                        </div>
                                    )}
                                    <div className="py-4">
                                        <div className='flex justify-between items-center'>
                                            <div className="font-semibold text-xl mb-2">
                                                {restaurant.restaurantName}
                                                <div className="text-sm text-gray-600">{restaurant.restaurantAddress.pincode}, {restaurant.restaurantAddress.streetName}, {restaurant.restaurantAddress.city}</div>
                                            </div>
                                            <div className={`text-white font-semibold text-base rounded-md p-1 ${restaurant.restaurantRating < 4.5 ? `bg-green-600` : `bg-green-900`}`}>
                                                {restaurant.restaurantRating}
                                            </div>
                                        </div>
                                        <div className={`font-semibold text-sm ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                                            {isOpen ? 'Open' : 'Closed'}
                                        </div>
                                    </div>
                                    {!isOpen && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                                <FaBan className="text-white text-3xl" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-xl mt-24">
                        No Restaurants are serving {categoryName} at the moment!
                    </div>
                )}
            </div>
        </>
    );
};

export default RestaurantsByCategory;