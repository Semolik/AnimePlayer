import React from 'react';
import './Header.css';

import { Link } from 'react-router-dom';
import settings from '../../settings';
import Loading from '../../components/Loading/Loading';
import { Route, Switch} from 'react-router-dom';
class Header extends React.Component {
	
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: {},
			props: props,
		};
	}
	componentDidMount() {
		fetch(`${settings.api}/services`)
			.then(res => res.json())
			.then(
				(result) => {
					
					this.setState({
						isLoaded: true,
						items: result
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
	}
	menuBtnChange() {
		var sidebar = document.querySelector(".sidebar");
		sidebar.classList.toggle("open");
	}
	LoadGenres(event){
		var service_id = event.match.params.service;
		console.log(service_id);
		var list = [];
		if(this.state.items.hasOwnProperty(service_id)){
			var genres = this.state.items[service_id].genres;
			for (var genre_name in genres){
				list.push(<div className='genrename' key={genre_name}>{genres[genre_name].name}</div>);
				for (var genre_key in genres[genre_name].links){
					var genre = genres[genre_name].links[genre_key];
					var url = `/${service_id}/genre/${genre[1]}`;
					list.push(<Link className="genre" to={url} key={url}>{genre[0]}</Link>);
				}
			}
		}
		return <div className='genres'>{list}</div>;
	}
	submitForm (event,service) {
		event.preventDefault();
		window.location.href=`${service ? "/"+service: ""}/search/${decodeURIComponent(event.target.text.value)}`;
	  }
	render() {
		const { error, isLoaded, items } = this.state;
		console.log(items);
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else {
			return (
				<header className='header'>
					<link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'></link>
					<div className="sidebar">
						<div className="nav-list" >
							<li key={-1}>
									<Link to={"/"} className='sidebar-item' onClick={this.menuBtnChange}>
										<div className="index"><span >Главная</span></div>
									</Link>
							</li>
							{Object.keys(items).map((key) => (
								<li key={key}>
									<Link to={"/"+key} className='sidebar-item' onClick={this.menuBtnChange}>
										{/* <img
											src={service.icon}
											alt={service.title}
										/> */}
										<span className="index">{items[key].title}</span>
									</Link>
								</li>
							))}
							<Switch>
                    			<Route path='/:service' component={(event)=> this.LoadGenres(event, this.state)}/>
							</Switch>
						</div>
					</div>
					<div className='header-container'>
						<i 
							className='bx bx-menu'
							onClick={this.menuBtnChange}
							onLoad={document.getElementById('main').addEventListener('click',()=>{
								document.querySelector(".sidebar").classList.remove("open");
							})}
							id="btn">
						</i>
						<Switch>
                    		<Route path='/:service?' render={
								(props) => (
									<form className='input-container' onSubmit={(event)=> this.submitForm(event, props.match.params.service)}>
										<input type="text" name="text" className='search' placeholder='Введите название...'></input>
									</form>
								)
							}/>
						</Switch>
					</div>
				</header>
			);
	  }
	}
}

export default Header;