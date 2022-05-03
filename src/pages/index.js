import React from 'react';
import Loading from '../components/Loading/Loading';
import Card from '../components/card/card';
import Pagination from '../components/Pagination/Pagination';
import Title from '../components/Title/Title';
import './index.css';
import settings from '../settings';
import SettingsPage from './settings/settings';
import axios from 'axios';
// import services from '../services';
// import { Route, Switch } from 'react-router-dom';
import { Switch, Route, Link } from "react-router-dom";
class ServicePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			data: {},
			page: this.props.match.params.page,
			id: this.props.match.params.id,
			service: this.props.match.params.service,
			PageType: this.props.match.params.PageType,
			PageNumber: this.props.match.params.PageNumber,
			// api: `http://127.0.0.1/api/${this.props.match.params.service}/`,
			// api: `http://192.168.50.106:80/api/${this.props.match.params.service}/`,
			page_type: '',
			page_: 1,
			horny_mode: localStorage['horny-mode'] === "true",
			LoadingButton: false,
		};
	}
	SetHornyMode(bool) {
		if (this.state.service === "favorites") {
			this.setState({ horny_mode: bool })

		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.state.service === "favorites") {
			if (prevState.horny_mode !== this.state.horny_mode) {
				this.loadFavorites();
			}
		} else if (prevState.id !== this.state.id) {
			this.setState({
				LoadingButton: true,
			});
			this.loadData();
		}
	}
	loadFavorites() {
		var service_saved = localStorage.getItem('favorites');
		if (!service_saved) {
			this.setState({
				isLoaded: true,
				data: {},
				page_type: 'favorites',
			});
			return;
		}
		service_saved = JSON.parse(service_saved);
		Object.keys(service_saved).forEach(service => {
			Object.keys(service_saved[service]).forEach(id => {
				var horny = service_saved[service][id]['horny'];
				var favorite = service_saved[service][id]['favorite'];
				if (favorite && horny !== this.state.horny_mode) {
					delete service_saved[service][id];
				}
			});
		});
		this.setState({
			isLoaded: true,
			data: service_saved,
			page_type: 'favorites',
		});
	}
	loadSettings() {
		this.setState({
			isLoaded: true,
			page_type: 'settings',
		});

	}
	componentDidMount() {
		console.log(this.state.service)
		if (this.state.service === "favorites") {
			this.loadFavorites();
		}else if (this.state.service === "settings") {
			this.loadSettings();
		} else {
			this.loadData()
		}

	}
	loadData = () => {
		const self = this;
		if (this.state.page === undefined | this.state.page === 'page') {
			fetch(`${settings.api}/${this.state.service}/`, {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ page: this.state.id }),
			})
				.then(res => res.json())
				.then(
					(result) => {
						console.log(result);
						if (result.status === 200) {
							document.title = result.data.service_title
							// this.setState({
							// 	isLoaded: true,
							// 	data: result.data,
							// 	page_type: 'page',
							// });

							this.setState((prevState) => {
								result.data.data = prevState.data.data ? [...prevState.data.data, ...result.data.data] : result.data.data;
								return {
									isLoaded: true,
									data: result.data,
									page_type: 'page',
									LoadingButton: false,
								}
							});


						} else {
							this.setState({
								isLoaded: false,
								error: {
									message: result.message
								}
							});
						}
					},
					(error) => {
						this.setState({
							isLoaded: false,
							error
						});
					}
				)
		} else if (this.state.page === 'genre') {

			fetch(`${settings.api}/${this.state.service}/genre`, {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ genre: this.state.id, page: this.state.PageNumber }),
			})
				.then(res => res.json())
				.then(
					(result) => {
						console.log(result);
						if (result.status === 200) {
							document.title = result.data.genre_name;
							this.setState({
								isLoaded: true,
								data: result.data,
								page_type: 'genre',
								LoadingButton: false,
							});
						} else {
							this.setState({
								isLoaded: false,
								error: {
									message: result.message
								}
							});
						}
					},
					(error) => {
						this.setState({
							isLoaded: false,
							error
						});
					}
				)
		} else if (this.state.page === 'search') {
			document.title = 'Поиск';
			var body;
			var text = this.state.id;
			console.log(this.props.match.params);
			if (text === null) {
				this.setState({
					isLoaded: false,
					error: {
						message: 'Пустой запрос',
					}
				});
				return;
			}
			var page = this.state.PageType;
			if (!page) {
				body = { name: text };
			} else {
				body = { name: text, page: page };
			}
			fetch(`${settings.api}/${this.state.service}/search`, {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body),
			})
				.then(res => res.json())
				.then(
					(result) => {
						if (result.status === 200) {
							this.setState({
								isLoaded: true,
								data: result.data,
								page_type: 'search',
								LoadingButton: false,
							});
						} else {
							this.setState({
								isLoaded: false,
								error: {
									message: result.message
								}
							});
						}
					},
					(error) => {
						this.setState({
							isLoaded: false,
							error
						});
					}
				)
		} else if (this.state.service === 'search') {
			axios.post(`${settings.api}/search`, { text: this.state.page, horny: this.state.horny_mode })
				.then(function (response) {
					if (response.status === 200) {
						self.setState({
							isLoaded: true,
							data: response.data,
							page_type: 'search_all',
							LoadingButton: false,
						});
					} else if (response.message) {
						self.setState({
							isLoaded: false,
							error: {
								message: response.message,
							}
						});
					}
				})
				.catch(function (error) {
					self.setState({
						isLoaded: false,
						error
					});
				})
		} else if (this.state.page !== undefined) {
			fetch(`${settings.api}/${this.state.service}/title`, {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: this.state.page }),
			})
				.then(res => res.json())
				.then(
					(result) => {
						console.log(result);
						if (result.status === 200) {
							this.setState({
								isLoaded: true,
								data: result.data,
								page_type: 'title',
								LoadingButton: false,
							});
						} else {
							this.setState({
								isLoaded: false,
								error: {
									message: result.message
								}
							});
						}
					},
					(error) => {
						this.setState({
							isLoaded: false,
							error
						});
					}
				)
		} else {
			this.setState({
				isLoaded: false,
				error: {
					message: 'Шо'
				}
			});
		}
	}
	getParameterByName(name) {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		return urlParams.get(name);
	}

	loadMore = () => {
		this.setState((prevState) => ({
			id: prevState.id ? parseInt(prevState.id) + 1 : 2
		}));
	}
	render() {
		const { error, isLoaded, data, service, id, page_type, PageType, PageNumber, page, LoadingButton } = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading />;
		} else if (page_type === 'page' || page_type === 'genre' || page_type === 'search') {
			return (
				<div className='wrapper'>
					<div className='cards-container' >
						{data.data.map((item, i) => (
							<Card key={i} data={item} service={{ id: service }}></Card>
						))}
					</div>
					{page_type === 'page' && data.pages > 1 && (id === undefined ? 1 : parseInt(id)) !== data.pages &&
						<div className="load_more_container">
							<div className={"load_more" + (LoadingButton ? " loading-button" : "")} onClick={this.loadMore}>
								{LoadingButton &&
									<svg viewBox="25 25 50 50">
										<circle cx="50" cy="50" r="20"></circle>
									</svg>
								}
								{!LoadingButton &&
									<div className="text">Загрузить больше</div>
								}

							</div>
						</div>
					}

					{page_type === 'genre' &&
						<Pagination totalPages={data.pages} page={(PageNumber === undefined ? 1 : PageNumber)} url={`/${service}/genre/${id}/page/`} />
					}
					{page_type === 'page' &&
						<Pagination totalPages={data.pages} page={id === undefined ? 1 : id} url={`/${service}/page/`} />
					}
					{page_type === 'search' &&
						<Switch>
							<Route path='/:service/:search?/:text?/:page?' component={(event) => <Pagination props={event} totalPages={data.pages} page={PageType || 1} url={`/${service}/search/?text=${this.getParameterByName('text')}&page=`} />} />
						</Switch>

					}


				</div>
			)
		} else if (page_type === 'title') {
			return (
				<div className='wrapper'>
					<Title data={data} service={service} id={page}></Title>
				</div>
			)
		} else if (page_type === 'favorites') {
			return (<div className='wrapper'>
				<div className='cards-container'>
					{Object.keys(data).map((service, index) => {
						console.log();
						return Object.keys(data[service]).filter(id => data[service][id].favorite === true).map((id, index2) => {
							return <Card key={[index, index2].join('-')} data={{
								id: id,
								poster: data[service][id].poster,
								ru_title: data[service][id].ru_title,
								info_blocks: [data[service][id].service_title],
							}} service={{ id: service }}></Card>
						})
					})}
				</div>
			</div>
			)
		} else if (page_type === 'search_all') {
			return (
				<div className="wrapper">
					{data && data.data.map((service, key) => {
						return <div className='cards-container hide-cards' key={key}>
							<div className="links">
								<Link className='service-title' to={"/" + service.id}>
									{service.title}
								</Link>
								{service.data.length > 2 &&
									<Link className='service-title service-view-more' to={`/${service.id}/search/${this.state.page}`}>
										Остальные результаты
									</Link>
								}
							</div>
							{service.data.map((item, i) => (
								<Card key={i} data={item} service={service}></Card>
							))}
						</div>
					})}
				</div>
			);
			// return data.data.map((item, i)=>(
			// 				<div>{item.id}</div>
			// 			));
		} else if (page_type === 'settings') {
			return <SettingsPage />;
		}
	}
}
export default ServicePage;