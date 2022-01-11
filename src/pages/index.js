import React from 'react';
import Loading from '../components/Loading/Loading';
import Card from '../components/card/card';
import Pagination from '../components/Pagination/Pagination';
import './index.css';
// import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';  

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
			api: `http://127.0.0.1/api/${this.props.match.params.service}/`,
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
	render() {
		const { error, isLoaded, data, service, id, page_type} = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else if (page_type=='page'){
			
			return (
				<div className='wrapper'>
					<div className='cards-container'>
						{data.data.map((item, i) => (
							<Card key={i} data={item} service={service}></Card>
							))}
							{/* <Link to='/animevost/page/2'>fsdfsdfs</Link> */}
							
					</div>
					<Pagination totalPages={data.pages} page={id===undefined ? 1 : id} url={`/${service}/page/`}/>
				</div>
			)		
		} else if (page_type=='title'){
			console.log(data);
			return (
				<div className='wrapper'>
					<div className='title-container'>
						
					</div>
				</div>
			)
		}
	}
}
export default ServicePage;