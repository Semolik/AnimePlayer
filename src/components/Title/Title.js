import React from 'react';
import './Title.css';
import { Link } from 'react-router-dom';
import Plyr from 'plyr-react';
// import 'plyr-react/dist/plyr.css';
import settings from '../../settings';

function Title(event) {
	var id = event.id;
	var data = event.data;
	document.title = data.ru_title;
	var service = event.service;
	var player;
	var service_saved_info = localStorage.getItem('favorites');
	var favorite = false;
	if (service_saved_info){
		service_saved_info = JSON.parse(service_saved_info);
		if (service_saved_info[service]){
			if (service_saved_info[service][id]){
				var favorite = true;
			}
			
		}
	}
	// var saved = localStorage.saved;
	// var saved_data;
	// if (saved!==undefined){
	// 	try {
	// 		saved = JSON.parse(saved);
	// 		saved_data = saved[data.id];
	// 	} catch {
	// 		console.log('Ошибка чтения сохраненных серий.')
	// 	}
	// }
	// console.log(GetVideoUrl(data.series.data[0]['link']));
	return (
		<div className='title-container'>
			<link rel="stylesheet" href="https://cdn.plyr.io/3.6.12/plyr.css" />
			<div className='info-block'>
				<h1 className='name ru-name'>{data.ru_title}</h1>
				<h3 className='name en-name'>{data.en_title}</h3>
				<div className='box'>
					<div className='flex w-100 margin-bottom'>
						<div className='column'>
							<div className="title-poster-container">
								<img className='poster' src={data.poster} alt={data.ru_title}></img>
								<div className='block button favorites' onClick={(event)=> {
									var service_saved = localStorage.getItem('favorites');
									if (!service_saved){
										service_saved = {}
									} else {
										service_saved = JSON.parse(service_saved);
									}
									if (!service_saved[service]){
										service_saved[service] = {}
									}
									var favorite = document.getElementById('favorite');
									if (service_saved[service][id]){
										delete service_saved[service][id];
										favorite.classList.remove('active');
									} else {
										service_saved[service][id] = {
											ru_title: data.ru_title,
											en_title: data.en_title,
											poster: data.poster,
											service_title: data.service_title,
										};
										favorite.classList.add('active');
									}
									localStorage['favorites'] = JSON.stringify(service_saved);
								}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id = "favorite" className={(favorite? "active": "")}><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg></div>
							</div>
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
							{data.shikimori && data.shikimori.duration!==0 &&
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
								<Link className="block button" to={`/${service}/genre/${data.type[1]}`}><span>Тип</span>{data.type[0]}</Link> : <div className='block'><span>Тип</span>{data.type[0]}</div>
							)}
							{data.year && (data.year.length>1 ?
								<Link className="block button" to={`/${service}/genre/${data.year[1]}`}><span>Год</span>{data.year[0]}</Link> : <div className='block'><span>Год</span>{data.year[0]}</div>
							)}
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
							
							{data.shikimori && data.shikimori.score!==0 &&
								// <div className="star-ratings">
								// 	<div className="fill-ratings" style={{width: data.shikimori.score*10 +'%'}}>
								// 		<span>★★★★★</span>
								// 	</div>
								// 	<div className="empty-ratings">
								// 		<span>★★★★★</span>
								// 	</div>
								// </div>
								<a href={data.shikimori.url} className='block button' target="_blank" rel="noopener noreferrer">
									<span>Рейтинг</span>{data.shikimori.score}
								</a>
							}
						</div>

						{data.description &&
							<div className='description'>{data.description}</div>
						}
					</div>
					{data.series && data.series.data &&
						<div className='flex w-100 margin-bottom'>
							<Plyr source={data.series.data[0]} id='player' ref={(player_) => (player = player_)} options={{
								controls: ['play', 'progress','current-time','duration','mute','volume','captions','settings','pip','fullscreen'],
								i18n: {
									speed: 'Скорость',
									normal: 'Нормальная',
									quality: 'Качество',
								}
							}}/>
							<div className='series'>
								{/* <div className='button-box-1'>
									<div className='button' id='prev'>Прошлая серия</div>
									<div className='button' id='next'>Следущая серия</div>
								</div> */}
								<div className='button-box-2'>
									{data.series.data.map((element, key) => {
										// if (key===0){
										// 	player.plyr.source = element;
										// }
										return (<div className={'button'+(key===0? ' active' : '')} key={key} onClick={(e)=>{
											if (!e.target.classList.contains('active')){
												[].forEach.call(document.querySelectorAll('.series .button.active'), function(el) {
													el.classList.remove("active");
												});
												if (data.series.direct_link===false && key!==0){
													fetch(settings.api+element['link'])
													.then(res => res.json())
													.then(
														(result) => {
															if (result.status===200){
																player.plyr.source = result.data;
															} else {
																console.log('Ошибка полуения ссылки на видео');
															}
														},
														(error) => {
															console.log('Ошибка получения ссылки на видео');
														},
													);
												} else {
													player.plyr.source = element;
												}
												// if (localStorage.saved===undefined){
												// 	saving_data = {};
												// } else {
												// 	try {
												// 		saving_data = JSON.parse(localStorage.saved);
												// 	} catch {
												// 		saving_data = {};
												// 	}
												// }
												// saving_data[data.id] = source;
												// localStorage.saved = JSON.stringify(saving_data);
												e.target.classList.add("active");
											}
										}}>{element['name']}</div>)
									})}
								</div>
							</div>
						</div>
					}
					{/* {data.shikimori && data.shikimori.screenshots &&
						<div className='screenshots'>
							{data.shikimori.screenshots.map((element, index)=>{
								return <img src={element['original']}></img>
							})}
						</div>
					} */}
				</div>
			</div>
		</div>
	);
}

export default Title