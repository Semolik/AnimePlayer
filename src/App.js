import React from 'react';
import './App.css';


import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/home';
import ServicePage from './pages';
import Header from './components/Header/Header';

class App extends React.Component {
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
                            ]} {...props} /> 
                        )
                    }/>
                    <Route exact path='/' component={HomePage} />
                    <Redirect to='/' />
                </Switch>
            </div>
        );
    }
}

export default App;
