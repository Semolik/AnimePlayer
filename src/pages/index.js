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
			items: [],
			page: this.props.match.params.page,
			id: this.props.match.params.id,
			service: this.props.match.params.service,
			api: `http://127.0.0.1/api/${this.props.match.params.service}/`,
		};
	}
  
	componentDidMount() {
		if (this.state.page===undefined| (this.state.page==='page' && !isNaN(this.state.id))){
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
					// console.log(result);
					this.setState({
						isLoaded: true,
						items: result.data
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
		const { error, isLoaded, items, service} = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else {
			console.log(items);
			return (
				<div className='cards-container'>
					{items.map((item, i) => (
						<Card key={i} data={item} service={service}></Card>
						))}
						{/* <Link to='/animevost/page/2'>fsdfsdfs</Link> */}
						<Pagination totalPages={10} page={4} url={'asdasdd'}/>
				</div>
			)
				
	  }
	}
}
export default ServicePage;