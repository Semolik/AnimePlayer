import React from 'react';
import './App.css';
import Header from './components/Header/Header';

import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/home';
import ServisePage from './pages';

class App extends React.Component {
    render() {
        return (
            <div className='app'>
                <Header brand='Anime Player'></Header>
                <main className='main'>
                    <Switch>
                        <Route path='/:servise/:page?' render={
                            (props) => (
                                <ServisePage key={props.match.params.servise} {...props} /> 
                            )
                        }/>
                        <Route exact path='/' component={HomePage} />
                        <Redirect to='/' />
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;
