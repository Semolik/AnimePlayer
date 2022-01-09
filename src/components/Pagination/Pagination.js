import React from "react";
import './Pagination.css';
import { Link } from 'react-router-dom';

function Pagination (event){
	let active;
	var liTags = [];
	var page = event.page;
	var totalPages = event.totalPages;
	let beforePage = page - 1;
	let afterPage = page + 1;
	if(page > 1){ //show the next button if the page value is greater than 1
		liTags.push(<li class="btn prev"><span><i class="fas fa-angle-left"></i> Prev</span></li>);
	  }
	
	  if(page > 2){ //if page value is less than 2 then add 1 after the previous button
		liTags.push(<li class="first numb"><span>1</span></li>);
		if(page > 3){ //if page value is greater than 3 then add this (...) after the first li or page
		  liTags.push(<li class="dots"><span>...</span></li>);
		}
	  }
	if (page == totalPages) {
		beforePage = beforePage - 2;
	} else if (page == totalPages - 1) {
		beforePage = beforePage - 1;
	}
	// how many pages or li show after the current li
	if (page == 1) {
		afterPage = afterPage + 2;
	} else if (page == 2) {
		afterPage  = afterPage + 1;
	}
	for (var plength = beforePage; plength <= afterPage; plength++) {
		if (plength > totalPages) {
			continue;
		}
		if (plength == 0) {
			plength = plength + 1;
		}
		liTags.push(<li class="numb" active={page == plength}><span>{plength}</span></li>);
	}
	if(page < totalPages - 1){
		if(page < totalPages - 2){
			liTags.push(<li class="dots"><span>...</span></li>);
		}
		liTags.push(<li class="last numb"><span>{totalPages}</span></li>);
	  }
	
	  if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
		liTags.push(<li class="btn next"><span>Next <i class="fas fa-angle-right"></i></span></li>);
	  }
	return(

			<div className="pagination">
				<ul>{liTags}</ul>
			</div>
	)
	
}

export default Pagination;