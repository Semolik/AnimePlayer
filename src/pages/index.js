import React from 'react';
import Loading from '../components/Loading/Loading';
import './index.css';

class ServisePage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		  data: [],
		  isLoading: false,
		}
	  }

	componentDidMount() {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://192.168.50.106:80/api/animevost/genres', true); // замените адрес
		xhr.send();
		this.setState({ isLoading: true })
	
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) {
				return false
			}
	
			if (xhr.status !== 200) {
				console.log(xhr.status + ': ' + xhr.statusText)
			} else {
				this.setState({
					data: JSON.parse(xhr.responseText),
			 		isLoading: false,
				})
			}
		}
	}
	renderProducts() {
		const { data, isLoading } = this.state
		if (isLoading) {
			return <Loading/>
		} else {
			console.log(data);
			if (data.constructor === Object){
				return data['genre']['links'].map((item ,i)  => {
					return <div key={i}>{item[0]}</div>
				})
			
			}
			return <div>a</div>
			
		}
	}
	render() {
		return (
		  <div className='App'>
			<div className='container'>
				{this.renderProducts()}
			</div>
		  </div>
		)
	  }
	// render() {
	// 	// 
		
	// 	const { project, error } = this.state;

	// 	if (error)
	// 		return <div className='container'>Что-то пошло не так...</div>;

	// 	if (!project) return <div className='container'>Loading...</div>;
	// 	document.title = project.title;
	// 	// console.log(project);
	// 	return (
	// 		<div className='project'>
	// 			<div className='container'>
	// 				<img
	// 					className='project__screenshot'
	// 					src={project.icon}
	// 					alt={project.title}
	// 				/>

	// 				<h1 className='project__title'>{project.title}</h1>

	// 				<p className='project__description'>
	// 					{project.description}
	// 				</p>

	// 				<div className='project__stack'>
	// 					{project.stack.join(', ')}
	// 				</div>

	// 				<div>
	// 					<a href={project.link} className='project__link'>
	// 						Ссылка на проект
	// 					</a>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }
}

export default ServisePage;
