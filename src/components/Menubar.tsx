import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PreviousArrow from '../components/PreviousArrow';
import NextArrow from '../components/NextArrow';
import '../components/Slick-Arrows.css';

import Pizza from '../images/menu-1.png';
import Burger from '../images/menu-2.png';
import Noodles from '../images/menu-3.png';
import Pasta from '../images/menu-4.png';
import Sandwich from '../images/menu-5.png';
import Thali from '../images/menu-6.png';
import Dessert from '../images/menu-7.png';
import Salad from '../images/menu-8.png';
import Biryani from '../images/menu-9.png';
import Fish from '../images/menu-10.png';

const dishes = [
    { name: 'Pizza', image: Pizza },
    { name: 'Burger', image: Burger },
    { name: 'Noodles', image: Noodles },
    { name: 'Pasta', image: Pasta },
    { name: 'Sandwich', image: Sandwich },
    { name: 'Thali', image: Thali },
    { name: 'Dessert', image: Dessert },
    { name: 'Salad', image: Salad },
    { name: 'Biryani', image: Biryani },
    { name: 'Fish', image: Fish },
];

const Menubar: React.FC = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/category/${categoryName}`);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        prevArrow: <PreviousArrow />,
        nextArrow: <NextArrow />,
    };

    return (
        <div className='bg-zinc-100 p-10'>
            <div className='text-3xl'>Uniting You with Delicious Moments</div>
            <Slider {...settings} className='mt-5'>
                {dishes.map((dish, index) => (
                    <div key={index} className='text-center px-2 cursor-pointer' onClick={() => handleCategoryClick(dish.name)}>
                        <img src={dish.image} alt={dish.name} className='rounded-full w-40 h-40 mx-auto' />
                        <p className='mt-2'>{dish.name}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Menubar;