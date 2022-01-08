import React from "react";
import './card.css';

function Card(item){
    var data = item.data;
    return (
        <div className="card">
            <img src={data.poster} alt={data.ru_title}></img>
            <div>{data.ru_title}</div>
        </div>
    )
}

export default Card;