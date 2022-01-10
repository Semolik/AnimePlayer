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
		};
	}
  
	componentDidMount() {
		if (this.state.page===undefined| this.state.page==='page'){
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
						data: result.data
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
				console.log(3);
				this.setState({
					isLoaded: false,
					error
					});
				}
		)
		} else if (this.state.page!==undefined){
			//Обработка страницы отдельного аниме
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
		const { error, isLoaded, data, service, id} = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else {
			console.log(data);
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
				
	  }
	}
}
export default ServicePage;