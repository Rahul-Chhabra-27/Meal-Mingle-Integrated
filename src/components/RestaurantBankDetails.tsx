import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BankDetails {
    accountNumber: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
    panNumber: string;
    aadhaarNumber: string;
    gstNumber: string;
}

const RestaurantBankDetails: React.FC = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const location = useLocation();
    const nextPage = location.state?.nextPage || '/view-admin-restaurants';

    const initialBankDetails: BankDetails = {
        accountNumber: '',
        bankName: '',
        branchName: '',
        ifscCode: '',
        panNumber: '',
        aadhaarNumber: '',
        gstNumber: '',
    };

    const [bankDetails, setBankDetails] = useState<BankDetails>(initialBankDetails);
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBankDetails({ ...bankDetails, [name]: value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        localStorage.setItem('bankDetails', JSON.stringify(bankDetails));

        toast.success('Bank Details Saved Successfully!');
        setTimeout(() => {
            navigate(nextPage);
        }, 2000);
    };

    const handleClose = () => {
        navigate('/view-admin-restaurants');
    };

    const validateForm = () => {
        let isValid = true;
        const errors: string[] = [];

        // Account Number
        if (!bankDetails.accountNumber.trim()) {
            errors.push('Account Number is Required.');
            isValid = false;
        } else if (isNaN(Number(bankDetails.accountNumber))) {
            errors.push('Account Number must be a Number, not a String.');
            isValid = false;
        } else if (bankDetails.accountNumber.trim().length !== 12) {
            errors.push('Account Number must be exactly 12 Digits.');
            isValid = false;
        }

        // Bank Name
        if (!bankDetails.bankName.trim()) {
            errors.push('Bank Name is Required.');
            isValid = false;
        }

        // Branch Name
        if (!bankDetails.branchName.trim()) {
            errors.push('Branch Name is Required.');
            isValid = false;
        }

        // IFSC Code
        if (!bankDetails.ifscCode.trim()) {
            errors.push('IFSC Code is Required.');
            isValid = false;
        } else if (bankDetails.ifscCode.trim().length !== 11) {
            errors.push('IFSC Code must be exactly 11 Characters.');
            isValid = false;
        }

        // PAN Number
        if (!bankDetails.panNumber.trim()) {
            errors.push('PAN Number is Required.');
            isValid = false;
        } else if (!/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(bankDetails.panNumber.trim())) {
            errors.push('Invalid PAN Number Format. Example: ABCDE1234F');
            isValid = false;
        }

        // Aadhar Number
        if (!bankDetails.aadhaarNumber.trim()) {
            errors.push('Aadhar Number is Required.');
            isValid = false;
        } else if (isNaN(Number(bankDetails.aadhaarNumber))) {
            errors.push('Aadhar Number must contain only Numeric Characters.');
            isValid = false;
        } else if (bankDetails.aadhaarNumber.trim().length !== 12) {
            errors.push('Aadhar Number must be exactly 12 Digits.');
            isValid = false;
        }

        // GST Number
        if (!bankDetails.gstNumber.trim()) {
            errors.push('GST Number is Required.');
            isValid = false;
        } else if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(bankDetails.gstNumber.trim())) {
            errors.push('Invalid GST Number Format.');
            isValid = false;
        }

        setErrors(errors);
        if (errors.length > 0) {
            toast.error(errors[0]);
        }

        return isValid;
    };

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
                        Enter Bank Details
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={bankDetails.accountNumber}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    id="bankName"
                                    name="bankName"
                                    value={bankDetails.bankName}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    id="branchName"
                                    name="branchName"
                                    value={bankDetails.branchName}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    IFSC Code
                                </label>
                                <input
                                    type="text"
                                    id="ifscCode"
                                    name="ifscCode"
                                    value={bankDetails.ifscCode}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    PAN Number
                                </label>
                                <input
                                    type="text"
                                    id="panNumber"
                                    name="panNumber"
                                    value={bankDetails.panNumber}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Aadhar Number
                                </label>
                                <input
                                    type="text"
                                    id="aadhaarNumber"
                                    name="aadhaarNumber"
                                    value={bankDetails.aadhaarNumber}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="border-gray-300">
                            <label className="block text-base font-medium text-gray-700">
                                GST Number
                            </label>
                            <input
                                type="text"
                                id="gstNumber"
                                name="gstNumber"
                                value={bankDetails.gstNumber}
                                onChange={handleChange}
                                className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="inline-block px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                            >
                                Save Bank Details
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/view-admin-restaurants')}
                                className="inline-block px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RestaurantBankDetails;