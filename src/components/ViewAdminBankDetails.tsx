import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const ViewAdminBankDetails = () => {
    const navigate = useNavigate();
    const [bankDetails, setBankDetails] = useState<any>(null);
    useEffect(() => {
        async function fetchBankDetails() {
            const response = await fetch('http://localhost:8090/api/users/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.error === "" && data.data !== null) {
                setBankDetails(data.data);
            }
        }
        fetchBankDetails();
    }, []);

    const handleUpdate = () => {
        navigate('/update-admin-bank-details');
    };

    const handleCancel = () => {
        navigate('/view-admin-restaurants');
    };

    return (
        <>
            <AdminNavbar />
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md relative">
                    <div className="absolute top-0 right-0 m-4">
                        <button
                            onClick={handleCancel}
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
                        Bank Account Summary
                    </h3>
                    {bankDetails ? (
                        <div className="pt-1">
                            <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                            <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
                            <p><strong>Branch Name:</strong> {bankDetails.branchName}</p>
                            <p><strong>IFSC Code:</strong> {bankDetails.ifscCode}</p>
                            <p><strong>PAN Number:</strong> {bankDetails.panNumber}</p>
                            <p><strong>Aadhaar Number:</strong> {bankDetails.aadhaarNumber}</p>
                            <p><strong>GST Number:</strong> {bankDetails.gstNumber}</p>
                            <div className="flex justify-between mt-3">
                                <button
                                    type="submit"
                                    onClick={handleUpdate}
                                    className="inline-block px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-block px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>No Bank Details Found!</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewAdminBankDetails;