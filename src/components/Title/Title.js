import React from 'react';
import './Title.css';
import { Link } from 'react-router-dom';
import Plyr from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import settings from '../../settings';
// function spliting(elements){
// 	var out = new Array();
// 	for (var i = 0; i<elements.length; i++){
// 		out.push(elements[i]);
// 		out.push(<div key={i*-1-1}>,&nbsp;</div>);
// 	}
// 	out.pop();
// 	return out;
// }
// function Sourse(data){
// 	return {
// 		type: "video",
// 		sources: [
// 			{
// 				src: data['hd'],
// 				size: 720,
// 			},
// 			{
// 				src: data['std'],
// 				size: 480,
// 			}
// 		],
// 		poster: data['preview'],
// 	}
// }
function GetVideoUrl(url){
	const geturl = fetch(settings.api+url)
	.then(res => res.json())
	.then(
		(result) => {
			if (result.status===200){
				return result.data
			} else {
				console.log('Ошибка полуения ссылки на видео');
			}
		},
		(error) => {
			console.log('Ошибка получения ссылки на видео');
		},
	);
	// var res = Promise.all([geturl]).then(values => { 
	// 	return values[0]; 
	// });
	return geturl;
	// alert(url);
	// // return url;
	// var req = new XMLHttpRequest();
	// req.open('GET', settings.api+url, true);
	// req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// req.onload = function(){
	// 	if (req.response != null) {
	// 		var resp = JSON.parse(req.response);
	// 		if (resp.status===200){
	// 			console.log(resp.data);
	// 			return resp.data
	// 		}
	// 	}
		
	// };
	// req.send();
}
function Title(event) {
	var data = event.data;
	document.title = data.ru_title;
	var service = event.service;
	var player;
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
	return (
		<div className='title-container'>
			<div className='info-block'>
				<h1 className='name ru-name'>{data.ru_title}</h1>
				<h3 className='name en-name'>{data.en_title}</h3>
				<div className='box'>
					<div className='flex w-100 margin-bottom'>
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
								<Link className="block link" to={`/${service}/genre/${data.type[1]}`}><span>Тип</span>{data.type[0]}</Link> : <div className='block'><span>Тип</span>{data.type[0]}</div>
							)}
							{data.year && (data.year.length>1 ?
								<Link className="block link" to={`/${service}/genre/${data.year[1]}`}><span>Год</span>{data.year[0]}</Link> : <div className='block'><span>Год</span>{data.year[0]}</div>
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
								<a href={data.shikimori.url} className='block link' target="_blank" rel="noopener noreferrer">
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
							<Plyr source={data.series.direct_link===false ? GetVideoUrl(data.series.data[0]['link']) :data.series.data[0]} id='player' ref={(player_) => (player = player_)} options={{
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
										
										return (<div className='button' key={key} onClick={(e)=>{
											if (!e.target.classList.contains('active')){
												[].forEach.call(document.querySelectorAll('.series .button.active'), function(el) {
													el.classList.remove("active");
												});
												if (data.series.direct_link===false){
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