import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Usuario from '../components/usuario';
import Planta from '../components/planta';
import Catalogo from '../components/catalogo';

class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Usuario}></Route>
                    <Route exact path="/planta" component={Planta}></Route>
                    <Route exact path="/catalogo" component={Catalogo}></Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Routes;