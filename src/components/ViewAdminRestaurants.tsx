import React , { useEffect, useState }from 'react';
import AdminNavbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Address {
    pincode: string;
    streetName: string;
    city: string;
}

interface RestaurantItem {
    restaurantItemId: string;
    restaurantItemName: string;
    restaurantItemPrice: number;
    restaurantItemCategory: string;
    restaurantItemImageUrl: string;
    restaurantItemCuisineType: string;
    restaurantItemVeg: boolean;
}

interface RestaurantData {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: Address;
    restaurantRating: number;
    restaurantMinimumOrderAmount: number;
    restaurantDiscountPercentage: number;
    restaurantImageUrl: string;
    restaurantOperationDays: string;
    restaurantOperationHours: string;
    restaurantPhoneNumber: string;
}

interface RestaurantProp {
    restaurants: RestaurantData[];
    onDelete: (id: string) => void;
}

const ViewAdminRestaurants: React.FC<RestaurantProp> = ({ onDelete }) => {
    localStorage.setItem('bankDetails', JSON.stringify({"accountNumber":"121212121212","bankName":"SBI","branchName":"MAIHAR","ifscCode":"89I89I89I89","panNumber":"FHTPP5189N","aadhaarNumber":"787878787878","gstNumber":"19AAAAA0000A1Z5"}));
    const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
    const fetchRestaurants = async () => {
        try {
            const response = await fetch('http://localhost:8091/api/restaurants', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.error == "" && data.data != null) {
                toast.success('Restaurants Fetched Successfully!');
                setRestaurants(data.data.restaurants);
            }
            else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchRestaurants();
    },[])
    const navigate = useNavigate();

    const handleUpdate = (id: string) => {
        navigate(`/update-restaurant/${id}`);
    };

    const handleDelete = (id: string) => {
        onDelete(id);
        toast.success('Restaurant Deleted Successfully!');
    };

    const handleClick = (restaurantId: string) => {
        const bankDetails = localStorage.getItem(`bankDetails`);
        if (!bankDetails) {
            navigate(`/admin/enter-bank-details/${restaurantId}`, {
                state: { nextPage: `/view-admin-restaurant-items/${restaurantId}` }
            });
        } else {
            navigate(`/view-admin-restaurant-items/${restaurantId}`);
        }
    };

    const handleAddMenu = (restaurantId: string, restaurantName :string) => {
        const bankDetails = localStorage.getItem(`bankDetails`);
        if (!bankDetails) {
            navigate(`/admin/enter-bank-details/${restaurantId}`, {
                state: { nextPage: `/register-restaurant-item/${restaurantId}`}
            });
        } else {

            navigate(`/register-restaurant-item/${restaurantId}`, {
                state: {
                restaurantId: restaurantId
                }
            });
        }
    }
    return (
        <>
            <AdminNavbar />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Explore All Your Registered Restaurants</h1>
                {restaurants.length === 0 ? (
                    <div className="text-center text-xl">
                        <p className="mt-60 mb-4">No Restaurants Registered Yet!</p>
                        <p>Please <a href="/register-restaurant" className="text-blue-500 underline">Register a Restaurant</a> to View.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-3 gap-4'>
                        {restaurants.map((data) => (
                            <div className="relative max-w-xs rounded-xl overflow-hidden shadow-sm mt-12 cursor-pointer">
                                <img className={`w-full rounded-2xl h-60`} src={data.restaurantImageUrl} alt="Restaurant Image" onClick={() => handleClick(data.restaurantId)} />
                                {data.restaurantDiscountPercentage > 0 && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white font-semibold py-1 px-2 rounded-md">
                                        {`${data.restaurantDiscountPercentage}% OFF ABOVE ${data.restaurantMinimumOrderAmount}`}
                                    </div>
                                )}
                                <div className="py-4">
                                    <div className='flex justify-between items-center'>
                                        <div className="font-semibold text-xl mb-2">
                                            {data.restaurantName}
                                            <div className="text-sm text-gray-600">{`${data.restaurantAddress.pincode }, ${data.restaurantAddress.streetName}, ${data.restaurantAddress.city}`}</div>
                                        </div>
                                        <div className={`text-white font-semibold text-base rounded-md p-1 ${data.restaurantRating < 4.5 ? `bg-green-600` : `bg-green-900`}`}>
                                            {data.restaurantRating}
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleAddMenu(data.restaurantId, data.restaurantName)}
                                            className="inline-block px-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                                        >
                                            Add Menu
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(data.restaurantId)}
                                            className="inline-block px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(data.restaurantId)}
                                            className="inline-block px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)}
            </div>
        </>
    );
};

export default ViewAdminRestaurants;