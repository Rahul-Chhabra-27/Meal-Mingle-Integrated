import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Address {
    streetNumber: string;
    streetName: string;
    city: string;
    country: string;
}

interface RestaurantItem {
    restaurantItemId: string;
    restaurantItemName: string;
    restaurantItemPrice: number;
    restaurantItemCategory: string;
    restaurantItemImageUrl: string;
    restaurantItemCuisineType: string;
    restaurantItemVeg: boolean;
}

interface RestaurantData {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: Address;
    restaurantRating: number;
    restaurantMinimumOrderAmount: number;
    restaurantDiscountPercentage: number;
    restaurantAvailability: boolean;
    restaurantImageUrl: string;
    restaurantOperationDays: string;
    restaurantOperationHours: string;
    restaurantPhoneNumber: string;
    restaurantOwnerMail : string;
}

interface RegisterRestaurantProps {
    onSubmit?: () => void;
}

const RegisterRestaurant: React.FC<RegisterRestaurantProps> = ({ onSubmit }) => {
    const initialRestaurantData: RestaurantData = {
        restaurantId: '',
        restaurantName: '',
        restaurantAddress: {
            streetNumber: '',
            streetName: '',
            city: '',
            country: 'India',
        },
        restaurantRating: 1,
        restaurantMinimumOrderAmount: 0,
        restaurantDiscountPercentage: 0,
        restaurantAvailability: true,
        restaurantImageUrl: '',
        restaurantOperationDays: '',
        restaurantOperationHours: '',
        restaurantPhoneNumber: '',
        restaurantOwnerMail : ''
    };

    const [restaurantData, setRestaurantData] = useState<RestaurantData>(initialRestaurantData);
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

   async function saveRestaurantData() {
        const postRestaurantData = {
            restaurant : {
                restaurantName : restaurantData.restaurantName,
                restaurantAddress : {
                    pincode : restaurantData.restaurantAddress.streetNumber,
                    streetName : restaurantData.restaurantAddress.streetName,
                    city : restaurantData.restaurantAddress.city,
                    country : restaurantData.restaurantAddress.country
                },
                restaurantRating : 1,
                restaurantMinimumOrderAmount : restaurantData.restaurantMinimumOrderAmount,
                restaurantDiscountPercentage : 10,
                restaurantAvailability : restaurantData.restaurantAvailability ? "open":"closed",
                restaurantImageUrl : restaurantData.restaurantImageUrl,
                restaurantOperationDays : restaurantData.restaurantOperationDays,
                restaurantOperationHours : restaurantData.restaurantOperationHours,
                restaurantPhoneNumber : restaurantData.restaurantPhoneNumber,
            }
        }
        const response = await fetch('http://localhost:8091/api/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(postRestaurantData)
        })
        console.log(response);
        const data = await response.json()
        if(data.error === ""){
            toast.success(data.message);
            setRestaurantData(data.restaurant)
        }
        else {
            toast.error(data.message);
        }
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setRestaurantData(prevData => ({
                ...prevData,
                [parent as keyof RestaurantData]: {
                    ...(prevData[parent as keyof RestaurantData] as Address),
                    [child]: value,
                },
            }));
        }
        else {
            if (name === 'restaurantMinimumOrderAmount' || name === 'restaurantDiscountPercentage') {
                const numericValue = parseFloat(value);
                if (numericValue >= 0) {
                    setRestaurantData({ ...restaurantData, [name]: numericValue });
                }
            }
            else {
                setRestaurantData({ ...restaurantData, [name]: value });
            }
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        const newRestaurantData: RestaurantData = {
            ...restaurantData,
            restaurantId: Math.floor(10 + Math.random() * 90).toString(),
        };

        const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const updatedRestaurantData = [...storedRestaurants, newRestaurantData];

        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurantData));

        setRestaurantData(initialRestaurantData);
        if (onSubmit) onSubmit();
        toast.success('Restaurant Added Successfully!');
        setTimeout(() => {
            navigate('/view-admin-restaurants');
        }, 2000);
    };

    const handleClose = () => {
        navigate('/partner-with-us');
    };

    const validateForm = () => {
        let isValid = true;
        const errors: string[] = [];

        // Restaurant Name
        if (!restaurantData.restaurantName.trim()) {
            errors.push('Restaurant Name is Required.');
            isValid = false;
        }
        else if (/^\d+$/.test(restaurantData.restaurantName.trim())) {
            errors.push('Restaurant Name must be a String, not a Number.');
            isValid = false;
        }
        else if (restaurantData.restaurantName.trim().length < 5 || restaurantData.restaurantName.trim().length > 20) {
            errors.push('Restaurant Name must be between 5 to 20 Characters long.');
            isValid = false;
        }

        // Street Number
        if (!restaurantData.restaurantAddress.streetNumber.trim()) {
            errors.push('Street Number is Required.');
            isValid = false;
        }
        else if (isNaN(Number(restaurantData.restaurantAddress.streetNumber))) {
            errors.push('Street Number must be a Number, not a String.');
            isValid = false;
        }

        // Street Name
        if (!restaurantData.restaurantAddress.streetName.trim()) {
            errors.push('Street Name is Required.');
            isValid = false;
        }
        else if (/^\d+$/.test(restaurantData.restaurantAddress.streetName.trim())) {
            errors.push('Street Name must be a String, not a Number.');
            isValid = false;
        }
        else if (restaurantData.restaurantAddress.streetName.trim().length < 5 || restaurantData.restaurantAddress.streetName.trim().length > 30) {
            errors.push('Street Name must be between 5 to 30 Characters long.');
            isValid = false;
        }

        // City
        if (!restaurantData.restaurantAddress.city.trim()) {
            errors.push('City is Required.');
            isValid = false;
        }
        else if (/^\d+$/.test(restaurantData.restaurantAddress.city.trim())) {
            errors.push('City must be a String, not a Number.');
            isValid = false;
        }
        else if (restaurantData.restaurantAddress.city.trim().length < 3 || restaurantData.restaurantAddress.city.trim().length > 30) {
            errors.push('City must be between 3 to 30 Characters long.');
            isValid = false;
        }

        // Operation Days
        const operationDays = restaurantData.restaurantOperationDays.trim();

        if (!operationDays) {
            errors.push('Operation Days are Required.');
            isValid = false;
        }
        else {
            const operationDaysRegex = /^[a-zA-Z]{3}-[a-zA-Z]{3}$/;
            if (!operationDaysRegex.test(operationDays)) {
                errors.push('Operation Days must be of the format: Mon-Fri.');
                isValid = false;
            }
            else {
                const [startDay, endDay] = operationDays.split('-');
                const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

                if (!daysOfWeek.includes(startDay) || !daysOfWeek.includes(endDay)) {
                    errors.push('Invalid Days Provided. Days must be one of Mon, Tue, Wed, Thu, Fri, Sat, Sun.');
                    isValid = false;
                }
                else if (startDay === endDay) {
                    errors.push('Start Day and End Day must not be the Same.');
                    isValid = false;
                }
            }
        }

        // Operation Hours
        const operationHours = restaurantData.restaurantOperationHours.trim();

        if (!operationHours) {
            errors.push('Operation Hours are Required.');
            isValid = false;
        }
        else {
            const operationHoursRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]([AP]M)-(0?[1-9]|1[0-2]):[0-5][0-9]([AP]M)$/;

            if (!operationHoursRegex.test(operationHours)) {
                errors.push('Operation Hours must be in the format: 10:00AM-06:00PM.');
                isValid = false;
            }
            else {
                const [start, end] = operationHours.split('-');

                const convertTo24Hour = (time: any) => {
                    let [hours, minutes] = time.slice(0, -2).split(':');
                    const period = time.slice(-2);
                    hours = parseInt(hours, 10);
                    minutes = parseInt(minutes, 10);
                    if (period === 'PM' && hours !== 12) {
                        hours += 12;
                    }
                    else if (period === 'AM' && hours === 12) {
                        hours = 0;
                    }
                    return hours * 60 + minutes;
                };

                const startTime = convertTo24Hour(start);
                const endTime = convertTo24Hour(end);

                if (startTime === endTime) {
                    errors.push('Start Time and End Time must not be the Same.');
                    isValid = false;
                }
                else if (startTime >= endTime) {
                    errors.push('End Time must be after Start Time.');
                    isValid = false;
                }
            }
        }

        // Image URL
        if (!restaurantData.restaurantImageUrl.trim()) {
            errors.push('Image URL is Required.');
            isValid = false;
        }

        // Phone Number
        if (!restaurantData.restaurantPhoneNumber.trim()) {
            errors.push('Phone Number is Required.');
            isValid = false;
        }
        else if (!/^\d+$/.test(restaurantData.restaurantPhoneNumber.trim())) {
            errors.push('Phone Number must contain only Numeric Characters.');
            isValid = false;
        }
        else if (restaurantData.restaurantPhoneNumber.trim().length !== 10) {
            errors.push('Phone Number must be exactly 10 Digits.');
            isValid = false;
        }
        else if (!/^[6-9]\d{9}$/.test(restaurantData.restaurantPhoneNumber.trim())) {
            errors.push('Phone Number must start with 6, 7, 8, or 9');
            isValid = false;
        }

        setErrors(errors);
        if (errors.length > 0) {
            toast.error(errors[0]);
        }
        if (isValid) {
            saveRestaurantData();
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
                        Register New Restaurant
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-base font-medium text-gray-700">
                                    Restaurant Name
                                </label>
                                <input
                                    type="text"
                                    name="restaurantName"
                                    value={restaurantData.restaurantName}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Street Number
                                </label>
                                <input
                                    type="text"
                                    name="restaurantAddress.streetNumber"
                                    value={restaurantData.restaurantAddress.streetNumber}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Street Name
                                </label>
                                <input
                                    type="text"
                                    name="restaurantAddress.streetName"
                                    value={restaurantData.restaurantAddress.streetName}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="restaurantAddress.city"
                                    value={restaurantData.restaurantAddress.city}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="restaurantAddress.country"
                                    value={restaurantData.restaurantAddress.country}
                                    readOnly
                                    className="form-input mt-1 block w-full rounded-md shadow-sm bg-gray-100 border h-10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Operation Days
                                </label>
                                <input
                                    type="text"
                                    name="restaurantOperationDays"
                                    value={restaurantData.restaurantOperationDays}
                                    onChange={handleChange}
                                    placeholder="Mon-Fri"
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Operation Hours
                                </label>
                                <input
                                    type="text"
                                    name="restaurantOperationHours"
                                    value={restaurantData.restaurantOperationHours}
                                    onChange={handleChange}
                                    placeholder="10:00AM-06:00PM"
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <div className="border-gray-300">
                            <label className="block text-base font-medium text-gray-700">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="restaurantImageUrl"
                                value={restaurantData.restaurantImageUrl}
                                onChange={handleChange}
                                className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                            />
                        </div>
                        <div className="border-gray-300">
                            <label className="block text-base font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="restaurantPhoneNumber"
                                value={restaurantData.restaurantPhoneNumber}
                                onChange={handleChange}
                                className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Minimum Order Amount
                                </label>
                                <input
                                    type="number"
                                    name="restaurantMinimumOrderAmount"
                                    value={restaurantData.restaurantMinimumOrderAmount}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-700">
                                    Discount Percentage
                                </label>
                                <input
                                    type="number"
                                    name="restaurantDiscountPercentage"
                                    value={restaurantData.restaurantDiscountPercentage}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full rounded-md shadow-sm border h-10"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-rose-500 w-full h-12 text-white py-2 px-4 rounded-lg"
                        >
                            Register Restaurant
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterRestaurant;