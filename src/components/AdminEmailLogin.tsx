import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailInboxIcon from '../images/email-inbox-icon.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/setup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminEmailLogin = () => {
    localStorage.removeItem('token');
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const loginAdminToPortal = async () => {
        const adminData = { userEmail:email, userPassword : password };
        const response = await fetch('http://localhost:8090/api/users/login/admin',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(adminData)
        })
        const data = await response.json();
        console.log(data);
        if(data.error != "") {
            toast.error(data.message);
        }
        else {
            toast.success(data.message);
            localStorage.setItem('token',data.data.token);
            setTimeout(() => {
                navigate("/partner-with-us");
            }, 2000);
        }
    }
    const emailLogin = async () => {
        try {
            loginAdminToPortal();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "An Unknown Error Occurred during Login");
        }
    }

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <ToastContainer />
            <div className="fixed inset-0 bg-black bg-opacity-85 transition-opacity"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-97 sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className='flex'>
                                <h3 className="text-3xl font-semibold leading-6 text-gray-600" id="modal-title">Admin Login</h3>
                                <Link to='/partner-with-us'><div className='ml-60'>X</div></Link>
                            </div>
                            <img src={EmailInboxIcon} alt='Email Inbox Icon' className='w-24 h-24 mt-5 ml-40' />
                            <input onChange={(e) => setEmail(e.target.value)} className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter Email" required />
                            <input type='password' onChange={(e) => setPassword(e.target.value)} className="mt-5 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter Password" required />
                            <button onClick={emailLogin} className="mt-5 mb-3 bg-rose-500 w-full h-12 text-white py-2 px-4 rounded-lg">
                                Login with Email
                            </button>
                            {error && <div className="text-red-500 mt-2">{error}</div>}
                            <hr className='mt-4' />
                            <div className='text-base mt-5'>Already have an account? <Link to='/admin/login'><span className='text-red-500'>Log in</span></Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminEmailLogin;