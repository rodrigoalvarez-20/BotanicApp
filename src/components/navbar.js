import React from 'react';
import '../styles/App.css';

const NavigationBar = ({ logout }) => {

    return (

        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/planta">
                    <img src="plant.png" alt="" width="30" height="24" className="d-inline-block align-text-top" />
                    Botanica
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav" style={{ width: "100%" }}>
                        <a className="nav-link" href="/planta">Plantas</a>
                        <a className="nav-link" href="/catalogo">Catalogo</a>
                        <button style={{ margin: "auto", marginRight: "0px" }} className="btn btn-outline-warning" onClick={logout}>Cerrar sesion</button>
                    </div>

                </div>

            </div>
        </nav>

    )

}

export default NavigationBar;