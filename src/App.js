import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Header from './components/Header/Header';

import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/home';
import ServisePage from './pages';

class App extends React.Component {
    render() {
        return (
            <div className='app'>
                <Header brand='Anime Player'></Header>
                <NavigationBar/>
                <main className='main'>
                    <Switch>
                        <Route path='/:id' render={
                            (props) => (
                                <ServisePage key={props.match.params.id} {...props} /> 
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
