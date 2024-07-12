import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

interface OrderItem {
    orderItemName: string;
    orderItemPrice: number;
    orderItemQuantity: number;
}

interface Order {
    id: string;
    orderItems: OrderItem[];
    orderTotalPrice: number;
    orderDate: string;
    orderStatus: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
}
// "orderId": "1",
//                 "orderItems": [
//                     {
//                         "orderItemName": "Pizza",
//                         "orderItemQuantity": "4",
//                         "orderItemPrice": "300"
//                     }
//                 ],
//                 "orderTotalPrice": "300",
//                 "restaurantName": "Pizza Hut",
//                 "shippingAddress": "Manchester House, Near Nagwara 564500",
//                 "orderStatus": "Processing"
const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const token = localStorage.getItem('token');
    const fetchOrders = async() => {
        const response = await fetch('http://localhost:8093/api/orders',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        console.log(data.data.order)
        setOrders(data.data.order)
    }
    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrder = async (order: any) => {
        console.log(order)
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8093/api/orders/${order.orderId}`,{
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();

        if(data.error != "") {
            toast.error(data.message)
        }
        else {
            toast.success(data.message)
            fetchOrders();
        }
    };
    console.log(orders)
    return (
        <>
            <Navbar />
            <div className='p-4 pl-20'>
                <h1 className='text-3xl font-bold mb-4'>My Orders</h1>
                {orders.length === 0 ? (
                    <p>You have No Orders yet!</p>
                ) : (
                    <div className='space-y-4'>
                        {orders.map((order) => (
                            <div key={order.id} className='border p-4 rounded shadow mr-10'>
                                <h2 className='text-xl font-semibold mb-2'>Order ID: {order.id}</h2>
                                <p className='text-gray-600 mb-2'>Order Date: {order.orderDate}</p>
                                <p className='text-gray-600 mb-2'>Status: {order.orderStatus}</p>
                                <div className='space-y-2'>
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className='flex justify-between items-center p-2 border-b'>
                                            <div className='flex flex-col'>
                                                <span className='font-semibold'>{item.orderItemName}</span>
                                                <span className='text-gray-500'>Qty: {item.orderItemQuantity}</span>
                                            </div>
                                            <div className='flex flex-col items-end'>
                                                <span className='text-gray-500'>Price: ₹{item.orderItemPrice}</span>
                                                <span className='font-semibold'>Total: ₹{item.orderItemPrice * item.orderItemQuantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='font-semibold mt-2'>Total Amount: ₹{order.orderTotalPrice}</div>
                                {order.orderStatus === 'Pending' && (
                                    <button
                                        onClick={() => cancelOrder(order)}
                                        className='mt-2 px-4 py-2 bg-red-500 text-white rounded'
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyOrders;