import React from 'react';
import './App.css';


import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/home/home';
import ServicePage from './pages';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.hormymoderef = props.hormymoderef;
	}
	render() {
		return (
			<div className='container' id='main'>
				<Switch>
					<Route path='/:service/:page?/:id?/:PageType?/:PageNumber?/' render={
						(props) => (
							<ServicePage key={[
								props.match.params.service,
								props.match.params.page,
								props.match.params.id,
								props.match.params.PageType,
								props.match.params.PageNumber,
							]} {...props}/> 
						)
					}/>
					<Route exact path='/'  render={(props) => (<HomePage ref={this.hormymoderef} {...props}/>)} />
					<Redirect to='/' />
				</Switch>
			</div>
		);
	}
}

export default App;
