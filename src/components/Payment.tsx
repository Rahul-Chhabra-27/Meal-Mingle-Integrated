import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { CartItem, useCart } from '../context/CartContext';

interface Restaurant {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: {
        streetNumber: string;
        streetName: string;
        city: string;
        country: string;
    };
    restaurantRating: number;
    restaurantMinimumOrderAmount: number;
    restaurantDiscountPercentage: number;
    restaurantAvailability: boolean;
    restaurantImageUrl: string;
    restaurantOperationDays: string;
    restaurantOperationHours: string;
    restaurantPhoneNumber: number;
    restaurantItems: {
        restaurantItemId: string;
        restaurantItemName: string;
        restaurantItemPrice: number;
        restaurantItemCategory: string;
        restaurantItemImageUrl: string;
        restaurantItemCuisineType: string;
        restaurantItemVeg: boolean;
    }[];
}

interface PaymentState {
    items: CartItem[];
    restaurantId: Restaurant;
    totalPrice: number;
    restaurantName : string
}
type OrderItem = {
    orderItemName:string,
    orderItemQuantity:number,
    orderItemPrice:number,
}

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const { items, restaurantId , totalPrice, restaurantName } = state as PaymentState;
    const { cart, placeOrder } = useCart();
    const [orders,setOrders] = useState<any[]>([]);

    console.log(items, restaurantId, totalPrice, restaurantName)
    const payNow =async () => {
        console.log("Hello")
        window.location.href = 'http://localhost:8089';
        const token = localStorage.getItem('token')

        const orderItems:OrderItem[] = [];

        items.forEach((orderItem,i) => {
            orderItems.push({
                orderItemName:orderItem.restaurantItemName,
                orderItemPrice:orderItem.restaurantItemPrice,
                orderItemQuantity: orderItem.quantity
            })
        });
       // console.log(orderItems)
        const orderData = {
            orderItems: orderItems,
            orderTotalPrice:totalPrice,
            shippingAddress: "Manchester House, Near Nagwara 564500",
            restaurantName:restaurantName
        }
        console.log(orderData)
        const response = await fetch('http://localhost:8093/api/orders',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify(orderData)
         })
        const data = await response.json();
        setOrders(data);
    }
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPaymentDetails({
            ...paymentDetails,
            [name]: value
        });
    };
    console.log(orders);
    return (
        <>
            <Navbar/>
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Payment Details</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {items.map((item, index) => (
                        <div key={index} className='max-w-xs rounded-xl overflow-hidden shadow-sm'>
                            <img className='w-full rounded-2xl h-60 object-cover' src={`${item.restaurantItemImageUrl}`} alt={item.restaurantItemName} />
                            <div className='py-4'>
                                <div className='flex justify-between'>
                                    <div className='font-semibold text-xl mb-2'>{item.restaurantItemName}</div>
                                    <p className='font-semibold text-base p-1'>₹{item.restaurantItemPrice}</p>
                                </div>
                                <div className='mt-2 flex justify-between'>
                                    <p className='font-semibold text-base'>Quantity: {item.quantity}</p>
                                    <p className='font-semibold text-base'>Total Price: ₹{item.restaurantItemPrice * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='font-semibold text-base p-1 mt-4'>
                    Final Price: ₹{totalPrice}
                </div>
                <button onClick={payNow}  type='submit' className='px-4 py-2 bg-blue-500 text-white rounded'>Pay Now</button>
            </div>
        </>
    );
};

export default Payment;