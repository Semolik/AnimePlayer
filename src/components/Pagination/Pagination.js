import React from "react";
import './Pagination.css';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination'; 
function Pagination_(totalPages, page, url){
	let active = 2;
	let items = [];
	for (let number = 1; number <= 5; number++) {
		items.push(
			<Pagination.Item key={number} active={number === active}>
			{number}
			</Pagination.Item>,
		);
	}
	
	return (
		render(<Pagination size="sm">{items}</Pagination>)
	)
}

export default Pagination_;