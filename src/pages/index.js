import React from 'react';
import Loading from '../components/Loading/Loading';
import Card from '../components/card/card';
import './index.css';

class ServisePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: [],
			page: parseInt(this.props.match.params.page)
		};
	}
  
	componentDidMount() {;
		fetch("http://127.0.0.1/api/animevost/",{
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			  },
			body: JSON.stringify( {page: this.state.page} ),
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
	}
	render() {
		const { error, isLoaded, items } = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else {
			console.log(items);
			return (
				<div>
					{items.map((item, i) => (
						<Card key={i} data={item}></Card>
					))}
				</div>
				
			);
	  }
	}
}
export default ServisePage;
