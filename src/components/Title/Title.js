import React from 'react';
import './Title.css';
import { Link } from 'react-router-dom';
// function spliting(elements){
// 	var out = new Array();
// 	for (var i = 0; i<elements.length; i++){
// 		out.push(elements[i]);
// 		out.push(<div key={i*-1-1}>,&nbsp;</div>);
// 	}
// 	out.pop();
// 	return out;
// }
function Title(event) {
	var data = event.data;
	var service = event.service;
	return (
		<div className='title-container'>
			<div className='info-block'>
				<h1 className='name ru-name'>{data.ru_title}</h1>
				<h3 className='name en-name'>{data.en_title}</h3>
				<div className='box'>
					<div className='flex w-100'>
						<div className='column'>
							<img className='poster' src={data.poster} alt={data.ru_title}></img>
							{/* {data.genre && 
								<div className='genres'>{data.genre.map((element, key) =>{
									return <Link className="genre" to={`/${service}/genre/${element[1]}`} key={key}>{element[0]}</Link>
								})}</div>
							} */}
							{data.series && data.series.info &&
								<div className='block'>
									<span>Количество серий</span>{data.series.info[0]}
								</div>
							}
							{data.series && data.series.info.length>1 &&
								<div className='block'>
									<span>Следующий эпизод</span>{data.series.info[1]}
								</div>
							}
							{data.shikimori && data.shikimori.duration &&
								<div className='block'>
									<span>Длительность эпизода</span>{data.shikimori.duration} мин.
								</div>
							}
							{data.genre &&
								<div className='block'>
									<span>Жанры</span>
									<div className='elements'>
										{data.genre.map((element, key) =>{
											return <Link className="genre" to={`/${service}/genre/${element[1]}`} key={key}>{element[0]}</Link>
										})}
									</div>
								</div>
							}
							{data.type && (data.type.length>1 ?
								<Link className="block" to={`/${service}/genre/${data.type[1]}`}><span>Тип</span>{data.type[0]}</Link> : <div className='block'><span>Тип</span>{data.type[0]}</div>
							)
							}
							{data.director &&
								<div className='block'>
									<span>Режиссёр</span>{data.director}
								</div>
							}
							{data.shikimori && data.shikimori.licensors.length>0 &&
								<div className='block'>
									<span>Лицензировано</span>{data.shikimori.licensors.join(', ')}
								</div>
							}
							
							{data.shikimori && data.shikimori.score &&
								// <div className="star-ratings">
								// 	<div className="fill-ratings" style={{width: data.shikimori.score*10 +'%'}}>
								// 		<span>★★★★★</span>
								// 	</div>
								// 	<div className="empty-ratings">
								// 		<span>★★★★★</span>
								// 	</div>
								// </div>
								<a href={"https://shikimori.one"+data.shikimori.url} className='block' target="_blank" rel="noopener noreferrer">
									<span>Рейтинг</span>{data.shikimori.score}
								</a>
							}
						</div>

						{data.description &&
							<div className='description'>{data.description}</div>
						}
					</div>
					<div className='flex w-100'>
						
					</div>
				</div>
			</div>
		</div>
	);
}

export default Title