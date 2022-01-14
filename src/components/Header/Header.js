import React from 'react';
import './Header.css';

import { Link } from 'react-router-dom';
// import './NavigationBar.css';
import services from '../../services';
import Loading from '../../components/Loading/Loading';
class Header extends React.Component {
	
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: {}
		};
	}
  
	componentDidMount() {
		fetch("http://127.0.0.1/api/services")
		// fetch("http://192.168.50.106:80/api/services")
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					this.setState({
						isLoaded: true,
						items: result
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
	menuBtnChange() {
		var sidebar = document.querySelector(".sidebar");
		sidebar.classList.toggle("open");
	}
	render() {
		const { error, isLoaded, items } = this.state;
		if (error) {
			return <div>Ошибка: {error.message}</div>;
		} else if (!isLoaded) {
			return <Loading/>;
		} else {
			return (
                <header className='header'>
					<link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'></link>
                    <div className="sidebar">
                        <div className="nav-list" onLoad={this.test}>
                            {services.map((service, i) => (
                                <li key={i}>
                                    <Link to={"/"+service.id} className='sidebar-item'>
                                        <img
                                            src={service.icon}
                                            alt={service.title}
                                        />
                                        <span className="links_name">{service.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </div>
                    </div>
                    <div className='header-container'>
						<i 
							className='bx bx-menu'
							onClick={this.menuBtnChange}
							onLoad={document.getElementById('main').addEventListener('click',()=>{
								document.querySelector(".sidebar").classList.remove("open");
							})}
							id="btn">
						</i>
                        {/* <Link to='/' className='header-brand'>{this.props.brand}</Link> */}
						<div className='input-container'><input></input></div>
						
                    </div>
                </header>
			);
	  }
	}
}

export default Header;