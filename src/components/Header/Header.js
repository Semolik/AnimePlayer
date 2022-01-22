import React from 'react';
import './Header.css';

import { Link } from 'react-router-dom';
// import './NavigationBar.css';
import services from '../../services';
import Loading from '../../components/Loading/Loading';
import { Route, Switch } from 'react-router-dom';
class Header extends React.Component {
	
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: {}
		};
	}
	componentDidMount() {
		// fetch("http://127.0.0.1/api/services")
		fetch("http://192.168.50.106:80/api/services")
			.then(res => res.json())
			.then(
				(result) => {
					
					this.setState({
						isLoaded: true,
						items: result
					});
				},
				// Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
				// чтобы не перехватывать исключения из ошибок в самих компонентах.
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
	LoadGenres(event, state){
		var service_id = event.match.params.service;
		console.log(service_id);
		var list = new Array();
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
		// for (var button in buttons) {
		// 	button.addEventListener('click', (e)=>{
		// 		var genres_list = document.getElementById('genres');
		// 		console.log(this.state.items);
		// 	});
		// }
		return <div className='genres'>{list}</div>;
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
							{services.map((service, i) => (
								<li key={i}>
									<Link to={"/"+service.id} className='sidebar-item' onClick={this.menuBtnChange}>
										<img
											src={service.icon}
											alt={service.title}
										/>
										<span className="links_name">{service.title}</span>{}
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
						{/* <Link to='/' className='header-brand'>{this.props.brand}</Link> */}
						<form className='input-container' action={`/animevost/search`}>
							<input type="text" name="text" className='search' placeholder='Введите название...'></input>
						</form>
						
					</div>
				</header>
			);
	  }
	}
}

export default Header;