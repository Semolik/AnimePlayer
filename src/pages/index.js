import React from 'react';
import Loading from '../components/Loading/Loading';
import Card from '../components/card/card';
import Pagination from '../components/Pagination/Pagination';
import Title from '../components/Title/Title';
import './index.css';
import settings from '../settings';
// import services from '../services';
// import { Route, Switch } from 'react-router-dom';
import {Switch,Route} from "react-router-dom";
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
			
		};
	}
  
	componentDidMount() {
		
		if (this.state.page===undefined | this.state.page==='page'){

			fetch(`${settings.api}/${this.state.service}/`,{
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {page: this.state.id} ),
			})
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					if (result.status===200){
						this.setState({
							isLoaded: true,
							data: result.data,
							page_type: 'page',
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
		} else if (this.state.page==='genre'){
			
			fetch(`${settings.api}/${this.state.service}/genre`,{
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {genre: this.state.id, page: this.state.PageNumber} ),
			})
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					if (result.status===200){
						document.title = result.data.genre_name;
						this.setState({
							isLoaded: true,
							data: result.data,
							page_type: 'genre',
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
		} else if (this.state.page==='search') {
			document.title = 'Поиск';
			var body;
			var text = this.state.id;
			console.log(this.props.match.params);
			if (text===null){
				this.setState({
					isLoaded: false,
					error: {
						message: 'Пустой запрос',
					}
				});
				return;
			}
			var page = this.state.PageType;
			if (!page){
				body =  {name: text};
			} else {
				body =  {name: text, page: page};
			}
			fetch(`${settings.api}/${this.state.service}/search`,{
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
					console.log(result);
					console.log(result.status);
					if (result.status===200){
						this.setState({
							isLoaded: true,
							data: result.data,
							page_type: 'search',
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
		} else if (this.state.page!==undefined){
			fetch(`${settings.api}/${this.state.service}/title`,{
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {id: this.state.page} ),
			})
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					if (result.status===200){
						this.setState({
							isLoaded: true,
							data: result.data,
							page_type: 'title',
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
				isLoaded: true,
				error: {
					message:'asdasd'
				}
			});
		}
	}
	getParameterByName(name) {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		return urlParams.get(name);
	}
	render() {
		const { error, isLoaded, data, service, id, page_type,PageType,  PageNumber} = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else if (page_type==='page' || page_type==='genre' || page_type==='search'){
			return (
				<div className='wrapper'>
					<div className='cards-container' >
						{data.data.map((item, i) => (
							<Card key={i} data={item} service={{id: service}}></Card>
						))}
					</div>
					{page_type==='genre' &&
						<Pagination totalPages={data.pages} page={PageNumber===undefined ? 1 : PageNumber} url={`/${service}/genre/${id}/page/`}/>
					}
					{page_type==='page' &&
						<Pagination totalPages={data.pages} page={id===undefined ? 1 : id} url={`/${service}/page/`}/>
					}
					{page_type==='search' &&
					<Switch>
						<Route path='/:service/:search?/:text?/:page?' component={(event)=> <Pagination props={event} totalPages={data.pages} page={PageType || 1} url={`/${service}/search/?text=${this.getParameterByName('text')}&page=`}/>}/>
					</Switch>
						
					}
					
				</div>
			)		
		} else if (page_type==='title'){
			return (
				<div className='wrapper'>
					<Title data={data} service={service}></Title>
				</div>
			)
		}
	}
}
export default ServicePage;