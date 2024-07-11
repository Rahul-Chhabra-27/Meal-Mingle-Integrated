import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { auth } from '../firebase/setup';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import LogoutIcon from '../images/logout-icon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const [authStore, setAuthStore] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthStore(user || {});
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged Out Successfully!');
            setTimeout(() => {
                navigate('/partner-with-us');
            }, 2000);
        } catch (err) {
            console.error(err);
        }
        localStorage.clear();
    };

    return (
        <>
            <ToastContainer />
            <div className='flex items-center justify-between p-4'>
                <Link to='/partner-with-us'>
                    <h1 className='text-3xl font-extrabold italic ml-20'>MealMingle for Business</h1>
                </Link>
                <div className='flex items-center ml-auto'>
                    {authStore?.photoURL ? (
                        <img src={authStore.photoURL} alt='User Pic' className='w-12 h-12 rounded-full' />
                    ) : authStore?.displayName ? (
                        <Avatar name={authStore.displayName} round={true} size='40' className='' />
                    ) : null}
                    <div className='ml-2 mr-10'>
                        {authStore?.displayName ? authStore.displayName : authStore?.email ? authStore.email : ''}
                    </div>
                    {authStore?.phoneNumber && <div className="text-gray-600 text-lg ml-2">{authStore.phoneNumber}</div>}
                    {!auth.currentUser?.email && !auth.currentUser?.phoneNumber && (
                        <Link to='/admin/login'>
                            <div className='text-gray-600 text-lg cursor-pointer mr-10'>Login</div>
                        </Link>
                    )}
                    {!auth.currentUser?.email && !auth.currentUser?.phoneNumber && (
                        <Link to='/admin/signup'>
                            <div className='text-gray-600 text-lg cursor-pointer mr-40'>Sign Up</div>
                        </Link>
                    )}
                    {localStorage.getItem('bankDetails') && (
                        <Link to='/view-admin-bank-details' className='relative'>
                            <div className='mr-12 shadow-lg p-2 rounded-xl text-black cursor-pointer w-15 h-15'>Bank Account Summary</div>
                        </Link>
                    )}
                    {auth.currentUser && (
                        <div>
                            <img onClick={logout} src={LogoutIcon} alt='Logout Icon' className='shadow-lg p-2 rounded-xl text-gray-600 cursor-pointer w-10 h-10 mr-20' />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminNavbar;