import React from 'react';
import './NavigationBar.css';
import services from '../../services';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
function menuBtnChange() {
	var sidebar = document.querySelector(".sidebar");
	sidebar.classList.toggle("open");
	var closeBtn = document.querySelector("#btn");
	if(sidebar.classList.contains("open")){
		closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
	} else {
		closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
	}
}
function test(){
	console.log(document.getElementsByClassName('sidebar-item'));
}
function NavigationBar()  {
	return (
			<div className="sidebar">
				<link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'></link>
				<div className="logo-details">
					<i className='bx bxl-c-plus-plus icon'></i>
					<div className="logo_name">CodingLab</div>
					<i className='bx bx-menu' onClick={menuBtnChange} id="btn"></i>
				</div>
				<ul className="nav-list" onLoad={test}>
					{services.map((service, i) => (
						<li key={i}>
							<Link to={service.id} className='sidebar-item'>
								<img
									src={service.icon}
									alt={service.title}
								/>
								<span className="links_name">{service.title}</span>
							</Link>
							<span className="tooltip">{service.title}</span>
						</li>
					))}
				</ul>
			</div>
			);
}

export default withRouter(NavigationBar);