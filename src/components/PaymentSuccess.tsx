import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import GreenTickIcon from '../images/green-tick-icon.png';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/order-history');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <div className='flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8' style={{ boxShadow: '0px 8px 8px -4px rgba(0, 0, 0, 0.1), 0px 4px 20px 0px rgba(0, 0, 0, 0.08)' }}>
                    <img src={GreenTickIcon} alt='Green Tick Icon' className='w-auto h-16 mb-6' />
                    <h1 className='font-bold text-3xl text-black mb-4'>Payment Successful!</h1>
                    <p className='text-md text-black mb-6 text-center'>
                        Your Payment was processed Successfully.
                        <br />
                        Thank You for your Order!
                    </p>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;