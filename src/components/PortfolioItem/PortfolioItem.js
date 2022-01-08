import React from 'react';
import './PortfolioItem.css';

import { Link } from 'react-router-dom';

function PortfolioItem({ work }) {
    return (
        <Link to={`/project/${work.id}`} className='portfolio-item'>
            <img
                className='portfolio-item__screenshot'
                src={work.icon}
                alt={work.title}
            />
            <div className='portfolio-item__title'>{work.title}</div>
        </Link>
    );
}

export default PortfolioItem;
