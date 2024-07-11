import PartnerWithUsBanner from '../images/partner-with-us-banner.png';
import { isAuthenticated } from '../utils/authUtils';
import { Link, useNavigate } from 'react-router-dom';

const PartnerWithUs = () => {
    const navigate = useNavigate();

    const handleRegisterRestaurantClick = () => {
        if (isAuthenticated()) {
            navigate('/register-restaurant');
        } else {
            navigate('/admin/login');
        }
    };

    const handleViewRestaurantsClick = () => {
        if (isAuthenticated()) {
            navigate('/view-admin-restaurants');
        } else {
            navigate('/admin/login');
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${PartnerWithUsBanner})`,
            }}
        >
            {!isAuthenticated() && (
                <div style={{ position: 'absolute', top: '40px', right: '20px' }}>
                    <Link to='/admin/login'>
                        <button className='text-base px-4 py-2 text-white rounded-md border border-gray-300 mr-10'>
                            Log In
                        </button>
                    </Link>
                    <Link to='/admin/signup'>
                        <button className='text-base px-4 py-2 text-white rounded-md border border-gray-300 mr-40'>
                            Sign Up
                        </button>
                    </Link>
                </div>
            )}
            <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center text-white max-w-md">
                <h1 className="text-4xl font-bold mb-6">Partner With <br />Meal Mingle</h1>
                <p className="text-lg mb-8 leading-relaxed">
                    Meal Mingle welcomes you to join our community of restaurants. Showcase your delicious cuisine and reach millions of food enthusiasts. Whether you're a hidden gem or a well-known establishment, we provide the platform to elevate your presence.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition duration-300"
                        onClick={handleRegisterRestaurantClick}
                    >
                        Register Your Restaurant
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300"
                        onClick={handleViewRestaurantsClick}
                    >
                        Login to View Your Existing Restaurants
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerWithUs;