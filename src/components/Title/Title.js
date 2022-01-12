import React from 'react';
import './Title.css';
import { Link } from 'react-router-dom';

function Title(event) {
    var data = event.data;
    var service = event.service;
    return (
        <div className='title-container'>
            <div className='info-block'>
			    <img className='poster' src={data.poster}></img>
                <div className='column'>
                    <h2 className='name ru-name'>{data.ru_title}</h2>
                    <h3 className='name en-name'>{data.en_title}</h3>
                    {data.genre && 
                            <div className='genres'>
                                {data.genre.map((element, key) =>{
                                    return <Link className='genre' to={`/${service}/genre/${element[1]}`} key={key}>{element[0]}</Link>
                                })}
                            </div>
                    }
                </div>
            </div>
		</div>
    );
}

export default Title