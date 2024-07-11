import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useCart, CartItem } from '../context/CartContext';
import restaurants from '../restaurants.json';

const Cart = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.restaurantItemPrice * item.quantity), 0);
    };

    const calculateDiscountedPrice = (totalPrice: number, minOrderAmount: number, discountPercentage: number) => {
        if (totalPrice > minOrderAmount) {
            const discountAmount = (totalPrice * discountPercentage) / 100;
            const discountedPrice = totalPrice - discountAmount;
            return { discountedPrice, discountAmount };
        } else {
            return { discountedPrice: totalPrice, discountAmount: 0 };
        }
    };
    let discountPercentage = cart.length > 0 ? Number(cart[0].restaurantDiscountPercentage) : 0;
    let totalAmount = calculateTotalPrice();
    let discounts = cart.length > 0 ? calculateDiscountedPrice(totalAmount,
Number(cart[0].restaurantMinimumOrderAmount), discountPercentage) : { discountedPrice:0, discountAmount : 0 };
       let discountedPrice = discounts.discountedPrice;
       let discountedAmount = discounts.discountAmount

    const proceedToPayment = () => {
        if (cart.length > 0) {
            
            navigate('/payment', {
                state: {
                    items: cart,
                    restaurantId : cart[0].restaurantId,
                    restaurantName : cart[0].restaurantName,
                    totalPrice: discountedPrice,
                }
            });
        }
    };

    return (
        <>
            <Navbar city="Location" />
            <div className='p-4 pl-20'>
                <h1 className='font-semibold text-3xl mb-4'>Your Cart</h1>
                {cart.length === 0 ? (
                    <p>Your Cart is Empty!</p>
                ) : (
                    <div>
                        <div className='grid grid-cols-3 gap-4'>
                            {cart.map((item: CartItem) => (
                                <div key={item.id} className='max-w-xs rounded-xl overflow-hidden shadow-sm'>
                                    <img className='w-full rounded-2xl h-60 object-cover' src={`${item.restaurantItemImageUrl}`} alt={item.restaurantItemName} />
                                    <div className='py-4'>
                                        <div className='flex justify-between items-center'>
                                            <div className='font-semibold text-xl mb-2'>{item.restaurantItemName}</div>
                                            <p className='font-semibold text-base p-1'>₹{item.restaurantItemPrice}</p>
                                        </div>
                                        <div className='flex justify-between items-center mt-2'>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className='mr-2 px-4 py-2 border border-gray-300 rounded'
                                            >
                                                {[...Array(10)].map((_, index) => (
                                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => removeFromCart(item.id)} className='inline-block px-2 py-2 bg-red-500 text-white rounded'>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-5'>
                            <p className='font-semibold'>Total Price: ₹{totalAmount}</p>
                            {cart && Number(cart[0].restaurantDiscountPercentage) > 0 && totalAmount > cart[0].restaurantMinimumOrderAmount && (
                                <>
                                    <p className='font-semibold'>Discount: {cart[0].restaurantDiscountPercentage}%</p>
                                    <p className='font-semibold'>Discount Amount: ₹{Number(discountedAmount).toFixed(2)}</p>
                                    <p className='font-semibold'>Discounted Price: ₹{Number(discountedPrice)}</p>
                                </>
                            )}
                            <button onClick={clearCart} className='mr-4 mt-5 px-4 py-2 bg-red-500 text-white rounded'>Clear Cart</button>
                            <button onClick={proceedToPayment} className='px-4 py-2 bg-green-500 text-white rounded'>Proceed to Payment</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;