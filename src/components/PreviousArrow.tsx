import React from 'react';

const PreviousArrow = (props: any) => {
    const { onClick } = props;
    return (
        <button onClick={onClick} className="slick-arrow slick-prev text-black" >
            &lt
        </button>
    );
};

export default PreviousArrow;