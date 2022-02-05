import React from "react";
import './card.css';
import { Link } from 'react-router-dom';

function Card(item){
    var data = item.data;
    return (
        <Link to={`/${item.service.id}/${data.id}`} className="card"  title={data.ru_title}>
            <div className="poster-container">
                <div className="blocks">
                    {data.announce &&
                        <div className="block" data-text="Анонс"></div>
                    }
                </div>
                <img src={data.poster} alt={data.ru_title}></img>
            </div>
            <div className="title">{data.ru_title}</div>
        </Link>
    )
}

export default Card;