import React from 'react';
import HomeBanner from '../images/home-banner.png';
import { Link } from 'react-router-dom';
import RightArrowIcon from '../images/right-arrow-icon.png';
import RestaurantData from '../restaurants.json';
import { isAuthenticated } from '../utils/authUtils';

const Home = () => {
    const restaurants = RestaurantData;

    return (
        <>
            <div
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${HomeBanner})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}
                className='text-white text-center'
            >
                {!isAuthenticated() && (
                    <div style={{ position: 'absolute', top: '40px', right: '20px' }}>
                        <Link to='/partner-with-us'>
                            <button className='text-base px-4 py-2 text-white rounded-md border border-gray-300 mr-10'>
                                Add Restaurant
                            </button>
                        </Link>
                        <Link to='/login'>
                            <button className='text-base px-4 py-2 text-white rounded-md border border-gray-300 mr-10'>
                                Log In
                            </button>
                        </Link>
                        <Link to='/signup'>
                            <button className='text-base px-4 py-2 text-white rounded-md border border-gray-300 mr-40'>
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}
                <h1 className='text-6xl font-extrabold italic'>Meal Mingle</h1>
                <h2 className='text-4xl mt-5'>
                    Mingle with Deliciousness <br />
                    from India
                </h2>
            </div>
            <div className='text-4xl text-center mt-8'>Explore All the Locations</div>
            <div className='text-xl text-gray-600 text-center mt-4'>
                From swanky upscale restaurants to the cosiest hidden gems serving the most incredible food, <br />
                MealMingle covers it all. Explore menus, and millions of restaurant photos and reviews from users <br />
                just like you, to find your next great meal.
            </div>
            <div className='grid grid-cols-3 gap-y-6 mt-6'>
                {restaurants.map((restaurant) => (
                    <Link key={restaurant.restaurantId} to='/main' state={{ city: restaurant.restaurantAddress?.city }}>
                        <div className='flex justify-between items-center border border-spacing-1 shadow-lg w-80 p-5 rounded-lg mx-auto mt-6'>
                            <div className='text-xl'>{restaurant.restaurantAddress?.city}</div>
                            <img src={RightArrowIcon} alt='Right Arrow Icon' className='w-4 h-4' />
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Home;