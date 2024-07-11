import React from 'react';
import AdminNavbar from './AdminNavbar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RestaurantItem {
    restaurantItemId: string;
    restaurantItemName: string;
    restaurantItemPrice: number;
    restaurantItemCategory: string;
    restaurantItemImageUrl: string;
    restaurantItemCuisineType: string;
    restaurantItemVeg: boolean;
}

const ViewAdminRestaurantItems: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();

    const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const restaurant = storedRestaurants.find((r: any) => r.restaurantId === restaurantId);

    if (!restaurant) {
        toast.error('Restaurant Not Found!');
        return null;
    }

    const { restaurantItems } = restaurant;

    const handleUpdate = (restaurantItemId: string) => {
        navigate(`/update-restaurant-item/${restaurantId}/${restaurantItemId}`);
    };

    const handleDelete = (restaurantItemId: string) => {
        const updatedRestaurantItems = restaurantItems.filter((item: RestaurantItem) => item.restaurantItemId !== restaurantItemId);
        const updatedRestaurant = {
            ...restaurant,
            restaurantItems: updatedRestaurantItems
        };

        const updatedRestaurants = storedRestaurants.map((r: any) =>
            r.restaurantId === restaurantId ? updatedRestaurant : r
        );

        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        toast.success('Restaurant Item Deleted Successfully!');
        navigate(`/view-admin-restaurant-items/${restaurantId}`);
    };

    return (
        <>
            <AdminNavbar />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Explore the Menu of {restaurant.restaurantName}</h1>
                {restaurantItems.length === 0 ? (
                    <div className="text-center text-xl">
                        <p className="mt-60 mb-4">No Restaurant Items Registered Yet!</p>
                        <p>Please <Link to={`/register-restaurant-item/${restaurantId}`} className="text-blue-500 underline">Register a Restaurant Item</Link> to View.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-3 gap-4'>
                        {restaurantItems.map((item: RestaurantItem) => (
                            <div key={item.restaurantItemId} className="relative max-w-xs rounded-xl overflow-hidden shadow-sm mt-12 cursor-pointer">
                                <img className={`w-full rounded-2xl h-60`} src={item.restaurantItemImageUrl} alt="Restaurant Item Image" />
                                <div className="py-4">
                                    <div className='flex justify-between items-center'>
                                        <div className="font-semibold text-xl mb-2">
                                            {item.restaurantItemName}
                                            <div className="text-sm text-gray-600">{item.restaurantItemCategory}</div>
                                        </div>
                                        <div className="text-white font-semibold text-base rounded-md p-1 bg-green-600">
                                            ₹{item.restaurantItemPrice}
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleUpdate(item.restaurantItemId)}
                                            className="inline-block px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.restaurantItemId)}
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

export default ViewAdminRestaurantItems;