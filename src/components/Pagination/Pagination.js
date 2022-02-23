import React from "react";
import './Pagination.css';
import { Link } from 'react-router-dom';

function Pagination (event){
	console.log(event);
	var liTags = [];
	var url = event.url;
	var params = event.props;
	if (params!==undefined){
		params = params.match.params;
	}
	var page = parseInt(event.page);
	var totalPages = event.totalPages;
	let beforePage = page - 1;
	let afterPage = page + 1;
	if(page > 1){
		liTags.push(<Link className="btn prev"  to={params!==undefined? `/${params.service}/search/${params.text}/${page - 1}`:url+(page - 1)} key={url+(page - 1)+'prev'}><span><i className="fas fa-angle-left"></i> Prev</span></Link>);
	}
	if(page > 2){
		liTags.push(<Link className="first numb" to={params!==undefined? `/${params.service}/search/${params.text}/1`:url+1} key={url+1+'first'}><span>1</span></Link>);
	}
	if (page === totalPages && totalPages>3) {
		beforePage = beforePage - 2;
	} else if (page === totalPages - 1) {
		beforePage = beforePage - 1;
	}
	if (page === 1  && totalPages>3) {
		afterPage = afterPage + 2;
	} else if (page === 2) {
		afterPage  = afterPage + 1;
	}
	for (var plength = beforePage; plength <= afterPage; plength++) {
		if (plength > totalPages) {
			continue;
		}
		if (plength === 0) {
			plength = plength + 1;
		}
		liTags.push(<Link className={`numb${page === plength ? ' active' : ''}`} to={params!==undefined? `/${params.service}/search/${params.text}/${plength}`:url+plength} key={url+plength}><span>{plength}</span></Link>);
	}
	if(page < totalPages - 1){
		liTags.push(<Link className="last numb" to={params!==undefined? `/${params.service}/search/${params.text}/${totalPages}`:url+totalPages} key={url+totalPages+'last'}><span>{totalPages}</span></Link>);
	}
	
	if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
		liTags.push(<Link className="btn next" to={params!==undefined? `/${params.service}/search/${params.text}/${page + 1}`:url+(page + 1)} key={url+(page + 1)+'next'}><span>Next <i className="fas fa-angle-right"></i></span></Link>);
	}
	return(
		<div className="pagination">
			<ul>{liTags}</ul>
		</div>
	)
	
}

export default Pagination;