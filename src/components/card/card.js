import React from "react";
import './card.css';

function Card(item){
    var data = item.data;
    return (
        <div className="card">
            <div className="poster-container">
                <img src={data.poster} alt={data.ru_title}></img>
                <div className="poster">

                </div>
            </div>
            <div className="title">{data.ru_title}</div>
        </div>
    )
}

export default Card;