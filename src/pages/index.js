import React from 'react';
import Loading from '../components/Loading/Loading';
import './index.css';

class ServisePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: []
		};
	}
  
	componentDidMount() {
	  fetch("http://127.0.0.1/api/animevost")
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					isLoaded: true,
					items: result.items
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
			return (
				<ul>
					
				</ul>
			);
	  }
	}
}
// class ServisePage extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			error: null,
// 			isLoaded: false,
// 			items: []
// 		};
// 	}
// 	componentDidMount() {
// 		fetch("http://192.168.50.106:80/api/animevost/genres")
// 		  .then(res => res.json())
// 		  .then(
// 			(result) => {
// 				this.setState({
// 					isLoaded: true,
// 					items: result.items
// 				});
// 			},
// 			// Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
// 			// чтобы не перехватывать исключения из ошибок в самих компонентах.
// 			(error) => {
// 				this.setState({
// 					isLoaded: true,
// 					error
// 				});
// 			}
// 		  )
// 	  }
	
// 	render() {
// 		return (
// 		  <div className='App'>
			
// 		  </div>
// 		)
// 	  }
// }

export default ServisePage;
