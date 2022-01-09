import React from 'react';
import './App.css';


import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/home';
import ServisePage from './pages';

class App extends React.Component {
    render() {
        return (
            <div className='container'>
                <Switch>
                    <Route path='/:servise/:page?/:id?' render={
                        (props) => (
                            <ServisePage key={[props.match.params.servise,props.match.params.page,props.match.params.id]} {...props} /> 
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
