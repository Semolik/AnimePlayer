import React from 'react';
import './Header.css';

// import button from '../button/button';
import { Link } from 'react-router-dom';
import settings from '../../settings';
import Loading from '../../components/Loading/Loading';
import { Route, Switch } from 'react-router-dom';
// import RippleButton from '../button/button';
class Header extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: {},
			props: props,
			horny_mode: localStorage['horny-mode'] === "true",
			hormymode_ref: props.hormymoderef,
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
	// componentDidUpdate(prevProps, prevState) {
	// 	if (prevState.horny_mode !== this.state.horny_mode) {
	// 		this.render();
	// 	}
	// }
	menuBtnChange() {
		var sidebar = document.querySelector(".sidebar");
		sidebar.classList.toggle("open");
	}
	LoadGenres(event) {
		var service_id = event.match.params.service;
		var list = [];
		if (this.state.items.hasOwnProperty(service_id)) {
			var genres = this.state.items[service_id].genres;
			for (var genre_name in genres) {
				list.push(<div className='genrename' key={genre_name}>{genres[genre_name].name}</div>);
				for (var genre_key in genres[genre_name].links) {
					var genre = genres[genre_name].links[genre_key];
					var url = `/${service_id}/genre/${genre[1]}`;
					list.push(<Link className="genre" to={url} key={url}>{genre[0]}</Link>);
				}
			}
		}
		return <div className='genres'>{list}</div>;
	}
	submitForm(event, service) {
		event.preventDefault();
		window.location.href = `${service && service!=='search' ? "/" + service : ""}/search/${decodeURIComponent(event.target.text.value)}`;
	}
	render() {
		const { error, isLoaded, items, horny_mode } = this.state;
		// console.log(items);
		// console.log(horny_mode);

		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading />;
		} else {
			return (
				<header className='header'>
					<link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'></link>
					<div className="sidebar">
						<div className="nav-list" >
							<Switch>
								<Route path='/:service?' render={
									(props) => {
										return [
											<li key={-4}>
												<Link to="/" className={"sidebar-item" + (!props.match.params.service ? " active" : "")} onClick={this.menuBtnChange}>
													<div className="index"><span>Главная</span></div>
												</Link>
											</li>,
											<li key={-3}>
												<Link to="/favorites" className={"sidebar-item" + (props.match.params.service === 'favorites' ? " active" : "")} onClick={this.menuBtnChange}>
													<div className="index"><span>Избранное</span></div>
												</Link>
											</li>,
											<li key={-2}>
												<div className={"sidebar-item button" + (localStorage['horny-mode'] === "true" ? " active" : "")}>
													<span className="index" onClick={(e => {
														var hornymode = e.target.parentNode.classList.toggle('active');
														if (this.state.hormymode_ref.current) {
															this.state.hormymode_ref.current.SetHornyMode(hornymode);
														}
														localStorage.setItem('horny-mode', hornymode);
														this.setState({ horny_mode: hornymode });
													})}>Horny mode</span>
												</div>
											</li>,
											<li key={-1} style={{display: 'none'}}>
												<Link to="/settings" className={"sidebar-item settings" + (props.match.params.service === 'settings' ? " active" : "")} onClick={this.menuBtnChange}>
													<div className="index"><span>Настройки</span></div>
												</Link>
											</li>,
										].concat(Object.keys(items).filter(key => (items[key].horny === horny_mode || props.match.params.service === key)).map((key) => (
											<li key={key}>
												<Link to={"/" + key} className={'sidebar-item' + (props.match.params.service === key ? " active" : "")} onClick={this.menuBtnChange}>
													<span className="index">{items[key].title}</span>
												</Link>
											</li>
										)));
									}}>
								</Route>
							</Switch>
							<Switch>
								<Route path='/:service' component={(event) => this.LoadGenres(event, this.state)} />
							</Switch>
						</div>
					</div>
					<div className='header-container'>
						<i
							className='bx bx-menu'
							onClick={this.menuBtnChange}
							onLoad={document.getElementById('main').addEventListener('click', () => {
								document.querySelector(".sidebar").classList.remove("open");
							})}
							id="btn">
						</i>
						<Switch>
							<Route path='/:service?' render={
								(props) => (
									<form className='input-container' onSubmit={(event) => this.submitForm(event, props.match.params.service)}>
										<input type="text" name="text" className='search' placeholder='Введите название...'></input>
									</form>
								)
							} />
						</Switch>
					</div>
				</header>
			);
		}
	}
}

export default Header;