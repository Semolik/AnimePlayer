import React from 'react';
import services from '../../services';
import './home.css';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import settings from '../../settings';
import Card from '../../components/card/card';
import Masonry from 'react-masonry-css'
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
		var data = {};
		Promise.all(services.map(item =>
			fetch(`${settings.api}/${item.id}/`,{
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {page: 1} ),
			}).then(resp => {return resp.json()})
			.then(json => {
				return {
					id: item.id,
					title: item.title,
					data: json.data
				}})
		))
		.then(responses => {
			this.setState({
				isLoaded: true,
				items: responses,
			});
		})
		.catch(error => {
				this.setState({
					isLoaded: false,
					error
				});
			});
		fetch('https://shikimori.one/api/topics?forum=news&limit=30')
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
					<div className='services'>
						{services.map((el, index)=>{
							return <Link className='service' key={index} to={"/"+el.id}>
								<img src={el.icon}/>
								<div className='title'>{el.title}</div>
							</Link>
						})}
					</div>
					{items.map((service, key) =>{
						console.log(service);
						return <div className='cards-container hide-cards' key={key}>
							<div className='service-title'>{service.title}</div>
							{service.data.data.map((item, i) => (
								<Card key={i} data={item} service={service}></Card>
							))}
						</div>
					})}
					{/* <div className='cards-container'> */}
					<Masonry
						breakpointCols={3}
						className="cards-container"
						columnClassName="cards-container-column">
						{shikimori.map((el, index)=>{
							return <a className='shikimori-card' key={index} href={`${settings.shikimori}${el.forum.url}/${el.id}`}>
							    <div className='title'>{el.topic_title}</div>
								{/* {function(){
									if (el.html_footer){
										var parser = new DOMParser();
										var footer = parser.parseFromString(el.html_footer, 'text/html');
										var images = [...footer.querySelectorAll('img')];
										if (images.length > 0){
											return <img src={images[0].attributes.src.nodeValue} />;
										}
									}
								}()} */}
							</a>
						})}
					</Masonry>
				</div> 
			);
		}
	}
}
export default HomePage;
