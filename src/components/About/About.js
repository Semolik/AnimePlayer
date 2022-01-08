import React from 'react';
import './About.css';

function About(props) {
    return (
        <div className='about'>
            <div className='about__bg'></div>
            <div className='container'>
                <h1 className='about__title'>{props.title}</h1>
                <div className='about__description'>{props.children}</div>
            </div>
        </div>
    );
}

export default About;
