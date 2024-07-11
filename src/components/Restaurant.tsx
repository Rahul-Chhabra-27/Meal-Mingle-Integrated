import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';
import { FaBan } from 'react-icons/fa';

interface RestaurantProp {
    restaurant: any,
    city: any
}

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

const Restaurant: React.FC<RestaurantProp> = ({ restaurant, city }) => {
    console.log(restaurant)
    return (
        <div className='p-4 pl-20'>
            <div className='font-semibold text-3xl'>
                {city ? `Best Food in ${city}` : 'Best Food in Location'}
            </div>
            <div className='grid grid-cols-3 gap-4'>
                {restaurant
                    .filter((data: any) => !city || data.restaurantAddress.city.includes(city))
                    .map((data: any) => {
                        const isOpen = isRestaurantOpen(data.restaurantOperationDays, data.restaurantOperationHours);
                        const offerPhrase = getOfferPhrase(data.restaurantMinimumOrderAmount, data.restaurantDiscountPercentage);
                        return (
                            <div key={data.restaurantId} className="relative max-w-xs rounded-xl overflow-hidden shadow-sm mt-12">
                                {isOpen ? (
                                    <Link to={isAuthenticated() ? '/menu' : '/login'} state={{ data: data }}>
                                        <img className={`w-full rounded-2xl h-60`} src={data.restaurantImageUrl} alt="Restaurant Image" />
                                    </Link>
                                ) : (
                                    <img className={`w-full rounded-2xl h-60 filter grayscale`} src={`${data.restaurantImageUrl}`} alt="Restaurant Image" />
                                )}
                                {data.restaurantDiscountPercentage > 0 && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white font-semibold py-1 px-2 rounded-md">
                                        {offerPhrase}
                                    </div>
                                )}
                                <div className="py-4">
                                    <div className='flex justify-between items-center'>
                                        <div className="font-semibold text-xl mb-2">
                                            {data.restaurantName}
                                            <div className="text-sm text-gray-600">{data.restaurantAddress.pincode}, {data.restaurantAddress.streetName}, {data.restaurantAddress.city}</div>
                                        </div>
                                        <div className={`text-white font-semibold text-base rounded-md p-1 ${data.restaurantRating < 4.5 ? `bg-green-600` : `bg-green-900`}`}>
                                            {data.restaurantRating}
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
                {restaurant.length === 0 && (
                    <div className="text-center col-span-3 text-xl mt-24">
                        No Restaurants Found!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Restaurant;