import React from 'react';
import './Title.css';
import { Link } from 'react-router-dom';
function Title(event) {
	var data = event.data;
	var service = event.service;
	var genre = data.genre.map((element, key) =>{
		return <Link className="genre" to={`/${service}/genre/${element[1]}`} key={key}>{element[0]}</Link>
	})
	var genres = new Array();
	for (var i = 0; i<genre.length; i++){
		genres.push(genre[i]);
		genres.push(<p key={i*-1-1}>,&nbsp;</p>);
	}
	genres.pop();
	return (
		<div className='title-container'>
			<div className='info-block'>
				<h1 className='name ru-name'>{data.ru_title}</h1>
				<h3 className='name en-name'>{data.en_title}</h3>
				<div className='box'>
					<img className='poster' src={data.poster}></img>
					<div className='column'>
						<ul>
							{data.series && data.series.info &&
								<li className='info-item'>
									<span>Количество серий:</span>{data.series.info[0]}
								</li>
							}
							{data.series && data.series.info.length>1 &&
								<li className='info-item'>
									<span>Следующий эпизод:</span>{data.series.info[1]}
								</li>
							}
							{data.genre &&
								<li className='info-item'>
									<span>Жанры:</span>{genres}
								</li>
							}
							{data.type &&
								<li className='info-item'>
									<span>Тип:</span>{data.type}
								</li>
							}
							{data.director &&
								<li className='info-item'>
									<span>Режиссёр:</span>{data.director}
								</li>
							}
							{/* {data.shikimori &&
								<li className='info-item'>
									<span>Режиссёр:</span>{data.director}
								</li>
							} */}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Title