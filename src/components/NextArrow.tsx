import React from 'react';

const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <button onClick={onClick} className="slick-arrow slick-next">
            &gt
        </button>
    );
};

export default NextArrow;