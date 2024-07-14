import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import EmailLogin from './components/EmailLogin';
import Main from './components/Main';
import Menu from './components/Menu';
import Payment from './components/Payment';
import PaymentSuccess from './components/PaymentSuccess';
import Cart from './components/Cart';
import RestaurantsByCategory from './components/RestaurantsByCategory';
import RestaurantsByCategoryMenu from './components/RestaurantsByCategoryMenu';
import RestaurantsByFilter from './components/RestaurantsByFilter';
import MyOrders from './components/MyOrders';
import PartnerWithUs from './components/PartnerWithUs';
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import AdminEmailLogin from './components/AdminEmailLogin';
import RegisterRestaurant from './components/RegisterRestaurant';
import ViewAdminRestaurants from './components/ViewAdminRestaurants';
import UpdateRestaurant from './components/UpdateRestaurant';
import RestaurantBankDetails from './components/RestaurantBankDetails';
import RegisterRestaurantItem from './components/RegisterRestaurantItem';
import ViewAdminRestaurantItems from './components/ViewAdminRestaurantItems';
import UpdateRestaurantItem from './components/UpdateRestaurantItem';
import ViewAdminBankDetails from './components/ViewAdminBankDetails';
import UpdateAdminBankDetails from './components/UpdateAdminBankDetails';

const App = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(storedRestaurants);
  }, []);

  const handleDelete = (id: string) => {
    const updatedRestaurants = restaurants.filter(r => r.restaurantId !== id);
    setRestaurants(updatedRestaurants);
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
  };

  return (
    <CartProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/emailLogin' element={<EmailLogin />} />
        <Route path='/main' element={<Main />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/category/:categoryName" element={<RestaurantsByCategory />} />
        <Route path="/category/:categoryName/menu" element={<RestaurantsByCategoryMenu />} />
        <Route path="/restaurants/filter" element={<RestaurantsByFilter />} />
        <Route path="/order-history" element={<MyOrders />} />
        <Route path="/partner-with-us" element={<PartnerWithUs />} />
        <Route path='/admin/signup' element={<AdminSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/emailLogin' element={<AdminEmailLogin />} />
        <Route path="/register-restaurant" element={<RegisterRestaurant />} />
        <Route path="/view-admin-restaurants" element={<ViewAdminRestaurants restaurants={restaurants} onDelete={handleDelete} />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />
        <Route path="/admin/enter-bank-details/:restaurantId" element={<RestaurantBankDetails />} />
        <Route path="/register-restaurant-item/:restaurantId" element={<RegisterRestaurantItem />} />
        <Route path="/view-admin-restaurant-items/:restaurantId" element={<ViewAdminRestaurantItems />} />
        <Route path="/update-restaurant-item/:restaurantId/:restaurantItemId" element={<UpdateRestaurantItem />} />
        <Route path="/view-admin-bank-details" element={<ViewAdminBankDetails />} />
        <Route path="/update-admin-bank-details" element={<UpdateAdminBankDetails />} />
      </Routes>
    </CartProvider>
  );
};

export default App;