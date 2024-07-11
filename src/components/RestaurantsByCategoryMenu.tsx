import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useCart, CartItem } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryMenu = () => {
    const location = useLocation();
    const { data, category } = location.state;
    const { addToCart } = useCart();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [restaurantItems,setRestaurantItems] = useState<CartItem[]>([]);

    const fetchRestaurantItems = async (restaurantId:string) => {
        const response = await fetch(`http://localhost:8091/api/restaurant/${restaurantId}/items`);
        const data = await response.json();
        if (data.error == "") {
            const filteredRestaurantItems = data.data.restaurantItems.filter((restaurantItem:CartItem) => restaurantItem.restaurantItemCategory ===  category)
            setRestaurantItems(filteredRestaurantItems);
        }
        else {
            toast.error(data.message);
        }
    }
    useEffect(() => {
        fetchRestaurantItems(data.restaurantId);
    },[]);

    const handleAddToCart = (item: CartItem) => {
        const quantity = quantities[item.restaurantItemId] || 1;
        item.restaurantMinimumOrderAmount = data.restaurantMinimumOrderAmount
        item.restaurantDiscountPercentage = data.restaurantDiscountPercentage
        item.restaurantName = data.restaurantName;
        const success = addToCart(item, quantity);
        if (success) {
            toast.success(`${item.restaurantItemName} added to Cart!`);
        }
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
        setQuantities(prevState => ({
            ...prevState,
            [itemId]: quantity,
        }));
    };

    //const categoryItems = data.restaurantItems.filter((item: any) => item.restaurantItemCategory === category);

    return (
        <>
            <Navbar city={data.restaurantAddress.city} />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Explore the {category} Menu of {data.restaurantName}</h1>
                <div className='grid grid-cols-3'>
                    {restaurantItems.map((item: CartItem) => (
                        <div key={item.restaurantItemId} className='max-w-xs rounded-xl overflow-hidden shadow-sm mt-12'>
                            <img className='w-full rounded-2xl h-60 object-cover' src={`${item.restaurantItemImageUrl}`} alt={item.restaurantItemName} />
                            <div className='py-4'>
                                <div className='flex justify-between items-center'>
                                    <div className='font-semibold text-xl mb-2'>{item.restaurantItemName}</div>
                                    <p className='font-semibold text-base p-1'>₹{item.restaurantItemPrice}</p>
                                </div>
                                <div className='flex justify-between items-center mt-2'>
                                    <select
                                        value={quantities[item.restaurantItemId] || 1}
                                        onChange={(e) => handleQuantityChange(item.restaurantItemId, parseInt(e.target.value))}
                                        className='mr-2 px-4 py-2 border border-gray-300 rounded'
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleAddToCart(item)} className='inline-block px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300'>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CategoryMenu;