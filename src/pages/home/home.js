import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import settings from '../../settings';
import Card from '../../components/card/card';
import axios from 'axios';
// import HorizontalScroll from 'react-scroll-horizontal';
import Fancybox from '../../components/Fancybox/Fancybox';
class HomePage extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			isShikimoriLoaded: false,
			items: {},
			shikimori: [],
			horny_mode: localStorage['horny-mode']==="true",

		};
	}
	// componentWillReceiveProps(props) {
	// 	// this.setState({ open: props.drawerOpen })
	// 	console.log(props)
	// }
	LoadNoHorny(){
		const self = this;
		axios.post(`${settings.api}/home`, {horny: false})
		.then(function (response) {
			if (response.status===200){
				self.setState({
					isLoaded: true,
					items: response.data.data,
				});
			} else {
				self.setState({
					isLoaded: false,
					error: {message: 'Ошибка получения домашней страницы'}
				});
			}
		})
		.catch(function (error) {
			self.setState({
				isLoaded: false,
				error
			});
		});
		axios.get('https://shikimori.one/api/topics?forum=news&limit=29')
		.then(function (response) {
			self.setState({
				isShikimoriLoaded: true,
				shikimori: response.data,
			});
		})
		.catch(function (error) {
			self.setState({
				isShikimoriLoaded: true,
				// error
			});
		});
		
	}
	LoadHorny(){
		const self = this;
		axios.post(`${settings.api}/home`, {horny: true})
		.then(function (response) {
			if (response.status===200){
				self.setState({
					isLoaded: true,
					items: response.data.data,
				});
			} else {
				self.setState({
					isLoaded: false,
					error: {message: 'Ошибка получения домашней страницы'}
				});
			}
		})
		.catch(function (error) {
			self.setState({
				isLoaded: false,
				error
			});
		});
		// axios.get('https://shikimori.one/api/topics?forum=news&limit=29')
		// .then(function (response) {
		// 	self.setState({
		// 		isShikimoriLoaded: true,
		// 		shikimori: response.data,
		// 	});
		// })
		// .catch(function (error) {
		// 	self.setState({
		// 		isShikimoriLoaded: false,
		// 		error
		// 	});
		// });
		self.setState({
			isShikimoriLoaded: true,
			shikimori: [],
		});
		
	}
	SetHornyMode(bool){
		this.setState({isLoaded: false,horny_mode:bool});
		if (bool){
			this.LoadHorny();
		} else {
			this.LoadNoHorny();
		}
	}
	componentDidMount() {
		if (this.state.horny_mode){
			this.LoadHorny();
		} else {
			this.LoadNoHorny();
		}
		
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
							<Link className='service-title' to={"/"+service.id}>
								{service.title}
							</Link>
							{service.data.map((item, i) => (
								<Card key={i} data={item} service={service}></Card>
							))}
						</div>
					})}
					{shikimori.length>0 &&
						<div className='shikimori-cards-container'>
							<div className='block-title'>Shikimori news</div>
							<Fancybox>
								{shikimori.map((el, index)=>{
									if (el.html_footer){
										var parser = new DOMParser();
										var footer = parser.parseFromString(el.html_footer, 'text/html');
										var images = [...footer.querySelectorAll('img')];
										if (images.length > 0){
											return images.map((image,image_index)=>(
												<div className="card-horizontal" title={el.topic_title} key={image_index} style={image_index>0 ? {'display': 'none'} : {}}>
													<div className="poster" data-fancybox={`gallery-${index}`} data-src={image.attributes.src.nodeValue}>
														<img src={image.attributes.src.nodeValue} alt={el.topic_title}/>
													</div>
													<div className="title">{el.topic_title}</div>
													<a href={`https://shikimori.one${el.forum.url}/${el.id}`} className="btn" target="_blank" rel="noopener noreferrer">Открыть</a>
												</div>
											));
										} 
										return null
									}
									return null
								})}
							</Fancybox>
						</div>
					}
				</div> 
			);
		}
	}
}
export default HomePage;
