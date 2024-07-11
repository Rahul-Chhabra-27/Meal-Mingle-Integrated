import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
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

interface Restaurant {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;
    restaurantItems: RestaurantItem[];
}

interface RegisterRestaurantItemProps {
    onSubmit?: () => void;
}

const categories = [
    'Pizza', 'Burger', 'Noodles', 'Pasta', 'Sandwich',
    'Thali', 'Dessert', 'Salad', 'Biryani', 'Fish'
];

const cuisineTypes = [
    'North Indian', 'South Indian'
];

const RegisterRestaurantItem: React.FC<RegisterRestaurantItemProps> = ({ onSubmit }) => {
    const { restaurantId } = useParams<{ restaurantId: string }>();

    const storedRestaurants: Restaurant[] = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const restaurant = storedRestaurants.find(r => r.restaurantId === restaurantId);

    if (!restaurant) {
        throw new Error('Restaurant Not Found!');
    }

    const restaurantItems = restaurant.restaurantItems || [];

    const nextItemNumber = restaurantItems.length + 1;

    const initialRestaurantItem: RestaurantItem = {
        restaurantItemId: `${restaurantId}_${nextItemNumber}`,
        restaurantItemName: '',
        restaurantItemPrice: 0,
        restaurantItemCategory: '',
        restaurantItemImageUrl: '',
        restaurantItemCuisineType: '',
        restaurantItemVeg: true,
    };

    const [restaurantItem, setRestaurantItem] = useState<RestaurantItem>(initialRestaurantItem);
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'restaurantItemPrice' && +value < 0) {
            return;
        }
        setRestaurantItem(prevItem => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setRestaurantItem(prevItem => ({
            ...prevItem,
            [name]: checked,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        const updatedRestaurant = {
            ...restaurant,
            restaurantItems: [...restaurantItems, restaurantItem]
        };

        const updatedRestaurants = storedRestaurants.map(r =>
            r.restaurantId === restaurantId ? updatedRestaurant : r
        );

        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        toast.success('Restaurant Item Added Successfully!');

        const nextItemNumberAfterSubmit = restaurantItems.length + 1;

        setRestaurantItem({
            ...initialRestaurantItem,
            restaurantItemId: `${restaurantId}_${nextItemNumberAfterSubmit}`,
            restaurantItemName: '',
            restaurantItemPrice: 0,
            restaurantItemCategory: '',
            restaurantItemImageUrl: '',
            restaurantItemCuisineType: '',
            restaurantItemVeg: true,
        });

        if (onSubmit) onSubmit();
        setTimeout(() => {
            navigate(`/view-admin-restaurant-items/${restaurantId}`);
        }, 2000);
    };

    const handleClose = () => {
        navigate('/view-admin-restaurants');
    };

    const validateForm = () => {
        let isValid = true;
        const errors: string[] = [];

        // Item Name
        if (!restaurantItem.restaurantItemName.trim()) {
            errors.push('Item Name is Required.');
            isValid = false;
        } else if (/^\d+$/.test(restaurantItem.restaurantItemName.trim())) {
            errors.push('Item Name must be a String, not a Number.');
            isValid = false;
        } else if (restaurantItem.restaurantItemName.trim().length < 5 || restaurantItem.restaurantItemName.trim().length > 20) {
            errors.push('Item Name must be between 5 to 20 Characters long.');
            isValid = false;
        }

        // Price (INR)
        if (restaurantItem.restaurantItemPrice <= 0) {
            errors.push('Price must be greater than 0.');
            isValid = false;
        }

        // Category
        if (!restaurantItem.restaurantItemCategory.trim()) {
            errors.push('Category is Required.');
            isValid = false;
        }

        // Cuisine Type
        if (!restaurantItem.restaurantItemCuisineType.trim()) {
            errors.push('Cuisine Type is Required.');
            isValid = false;
        }

        // Image URL
        if (!restaurantItem.restaurantItemImageUrl.trim()) {
            errors.push('Image URL is Required.');
            isValid = false;
        }

        setErrors(errors);
        if (errors.length > 0) {
            toast.error(errors[0]);
        }

        return isValid;
    }

    return (
        <>
            <AdminNavbar />
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md relative">
                    <div className="absolute top-0 right-0 m-4">
                        <button
                            onClick={handleClose}
                            className="text-gray-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                        Register New Restaurant Item
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-base font-medium text-gray-700">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    name="restaurantItemName"
                                    value={restaurantItem.restaurantItemName}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Price (INR)
                                </label>
                                <input
                                    type="number"
                                    name="restaurantItemPrice"
                                    value={restaurantItem.restaurantItemPrice}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    name="restaurantItemCategory"
                                    value={restaurantItem.restaurantItemCategory}
                                    onChange={handleChange}
                                    className="form-select mt-1 block w-full rounded-md shadow-sm border h-10"
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Cuisine Type
                                </label>
                                <select
                                    name="restaurantItemCuisineType"
                                    value={restaurantItem.restaurantItemCuisineType}
                                    onChange={handleChange}
                                    className="form-select mt-1 block w-full rounded-md shadow-sm border h-10"
                                >
                                    <option value="">Select a Cuisine Type</option>
                                    {cuisineTypes.map(cuisine => (
                                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Pure Veg
                                </label>
                                <div className="flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        name="restaurantItemVeg"
                                        checked={restaurantItem.restaurantItemVeg}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-rose-600"
                                    />
                                    <span className="ml-2 text-base text-gray-700">Vegetarian</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-gray-300">
                            <label className="block text-base font-medium text-gray-700">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="restaurantItemImageUrl"
                                value={restaurantItem.restaurantItemImageUrl}
                                onChange={handleChange}
                                className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-rose-500 w-full h-12 text-white py-2 px-4 rounded-lg"
                        >
                            Register Restaurant Item
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterRestaurantItem;