import React from "react";
import './card.css';
import { Link } from 'react-router-dom';

function Card(item){
    var data = item.data;
    var service = item.service;
    // var title = '';
    // var words = data.ru_title.split(' ');
    // for (var index = 0; index < words.length; index++) {
    //     if (title.length<50){
    //         title+=` ${words[index]}`;
    //     } else{
    //         if (title[-1]!='.'){
    //             if (title[-1]==','){
    //                 title = title.slice(0, -1);
    //             }
    //             title+='...';
    //         }
    //         console.log(title.length);
    //         break;
    //     }
    // }
    return (
        <Link to={`/${service}/${data.id}`} className="card">
            <div className="poster-container">
                <div className="blocks">
                    {data.announce &&
                        <div className="block announce"></div>
                    }
                </div>
                
                <img src={data.poster} alt={data.ru_title}></img>
                <div className="poster">
                    
                </div>
            </div>
            {/* <div className="title">{title.substring(1)}</div> */}
            <div className="title">{data.ru_title}</div>
        </Link>
    )
}

export default Card;