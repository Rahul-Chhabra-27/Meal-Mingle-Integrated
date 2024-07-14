import React, { useEffect, useState } from 'react';
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
    restaurantId: string;
}

const ViewAdminRestaurantItems: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();

    const [restaurantItems, setRestaurantItems] = useState<RestaurantItem[]>([]);
    const navigate = useNavigate();

    const fetchRestaurantItems = async() => {
        const response = await fetch(`http://localhost:8091/api/restaurant/${restaurantId}/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (data.error === "" && data.data !== null) {
            toast.success('Restaurant Items Fetched Successfully!');
            setRestaurantItems(data.data.restaurantItems);
        } else {
            toast.error(data.error);
        }
    }
    useEffect(() => {
        fetchRestaurantItems();
    },[])
    const handleUpdate = (restaurantItemId: string) => {
        navigate(`/update-restaurant-item/${restaurantId}/${restaurantItemId}`);
    };

    const handleDelete = async (restaurantItemId: string) => {
        if (restaurantId === undefined) {
            return;
        }
        const response = await fetch(`http://localhost:8091/api/restaurants/${restaurantId}/items/${restaurantItemId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
         });
            
        const data = await response.json();
        if (data.error === "") {
            toast.success('Restaurant Item Deleted Successfully!');
            fetchRestaurantItems();
        } else {
            toast.error(data.error);
        }
        return;
    };

    return (
        <>
            <AdminNavbar />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Explore the Menu of Restaurant Token No. {restaurantId}</h1>
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