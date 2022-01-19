import React from 'react';
import Loading from '../components/Loading/Loading';
import Card from '../components/card/card';
import Pagination from '../components/Pagination/Pagination';
import Title from '../components/Title/Title';
import './index.css';


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
			api: `http://192.168.50.106:80/api/${this.props.match.params.service}/`,
			page_type: '',
			
		};
	}
  
	componentDidMount() {
		if (this.state.page===undefined | this.state.page==='page'){
			fetch(this.state.api,{
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
			fetch(this.state.api+'genre',{
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
			alert(this.getParameterByName('text'));
		} else if (this.state.page!==undefined){
			fetch(this.state.api+'title',{
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
		} else if (page_type==='page' || page_type==='genre'){
			
			return (
				<div className='wrapper'>
					<div className='cards-container'>
						{data.data.map((item, i) => (
							<Card key={i} data={item} service={service}></Card>
						))}
					</div>
					{page_type==='genre' &&
						<Pagination totalPages={data.pages} page={PageNumber===undefined ? 1 : PageNumber} url={`/${service}/genre/${id}/page/`}/>
					}
					{page_type==='page' &&
						<Pagination totalPages={data.pages} page={id===undefined ? 1 : id} url={`/${service}/page/`}/>
					}
					
				</div>
			)		
		} else if (page_type==='title'){
			console.log(data);
			return (
				<div className='wrapper'>
					<Title data={data} service={service}></Title>
				</div>
			)
		}
	}
}
export default ServicePage;