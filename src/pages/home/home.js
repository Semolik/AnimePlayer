import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import settings from '../../settings';
import Card from '../../components/card/card';
import HorizontalScroll from 'react-scroll-horizontal';
class HomePage extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			isShikimoriLoaded: false,
			items: {},
			shikimori: {},

		};
	}
	componentDidMount() {
		fetch(`${settings.api}/home`)
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
						isLoaded: true,
						items: result.data,
					});
			},
			(error) => {
				this.setState({
					isLoaded: false,
					error
				});
			}
		);
		fetch('https://shikimori.one/api/topics?forum=news&limit=29')
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					isShikimoriLoaded: true,
					shikimori: result,
				});
			},
			(error) => {
				this.setState({
					isShikimoriLoaded: false,
					error
				});
			}
		);
	}
	render() {
		const { error, isLoaded, items, shikimori, isShikimoriLoaded} = this.state;
		console.log(items);
		console.log(shikimori);
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded || !isShikimoriLoaded) {
			return <Loading/>;
		} else {
			return (
				<div className='wrapper'>
					<div className='services' onWheel={(event) => {
						 const delta = Math.max(-1, Math.min(1, (event.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
						 event.currentTarget.scrollLeft -= (delta * 10)
						 event.preventDefault();
					}}>
						{/* <HorizontalScroll reverseScroll={true}> */}
							{items.map((el,key)=>{
								return <Link className='service' key={key} to={"/"+el.id}>
										<img src={settings.api+el.icon} alt={el.id}/>
									<div className='title'>{el.title}</div>
								</Link>
							})}
						{/* </HorizontalScroll> */}
					</div>
					{items.map((service,key) =>{
						return <div className='cards-container hide-cards' key={key}>
							<div className='service-title'>{service.title}</div>
							{service.data.map((item, i) => (
								<Card key={i} data={item} service={service}></Card>
							))}
						</div>
					})}
					<div className='shikimori-cards-container'>
						{/* <div className='block-title'>Shikimori news</div> */}
						{shikimori.map((el, index)=>{
							// console.log(el);
							return <a className="card-horizontal" href={`https://shikimori.one${el.forum.url}/${el.id}`} title={el.topic_title} key={index} target="_blank" rel="noopener noreferrer">
										<div className="poster">
											{/* <div className="blocks">
												{data.announce &&
													<div className="block" data-text="Анонс"></div>
												}
											</div> */}
											{function(){
												if (el.html_footer){
													var parser = new DOMParser();
													var footer = parser.parseFromString(el.html_footer, 'text/html');
													var images = [...footer.querySelectorAll('img')];
													console.log();
													if (images.length > 0){
														return <img src={images[0].attributes.src.nodeValue} alt={el.topic_title}/>;
													}
												}
											}()}
										</div>
										<div className="title">{el.topic_title}</div>
									</a>
						})}
					</div>
				</div> 
			);
		}
	}
}
export default HomePage;
