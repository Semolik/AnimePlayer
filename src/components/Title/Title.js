import React from 'react';
import './Title.css';

function Title(event) {
    var data = event.data;
    return (
        <div className='title-container'>
            <div className='info-block'>
			    <img className='poster' src={data.poster}></img>
                <div className='column'>
                    <h2 className='name ru-name'>{data.ru_title}</h2>
                    <h3 className='name en-name'>{data.en_title}</h3>
                </div>
            </div>
		</div>
    );
}

export default Title