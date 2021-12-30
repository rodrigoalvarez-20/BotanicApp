import React, { Component } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//const bdUrl="http://localhost:3001/usuarios";
const cookies = new Cookies();

class Usuario extends Component {
    state = {
        email: '',
        password: '',
        name: "",
        lastName: "",
        regEmail: "",
        regPassword: "",
        loginLoad: false,
        registerLoad: false
    }

    handleChange = (e) => {
        this.setState({
            [[e.target.name]]: e.target.value
        });
    }

    componentDidMount() {
        axios.get("/api").then(response => console.log(response.data)).catch(error => console.log(error));

        //console.log(cookies.getAll())

        if (cookies.get("email") && cookies.get("id")) {
            const user = cookies.get("nombre");
            toast.success(`Bienvenido de nuevo ${user}`);
            window.location.href = "/planta";
        }

    }

    loginUser = () => {
        const { email, password } = this.state;
        this.setState({ loginLoad: true });
        if (email.trim().length === 0 || password.trim().length === 0) {
            toast.warning("Los campos no pueden quedar vacios")
        } else {
            axios.post("/api/users/login.php", { email, password }).then(response => {
                const { error, message, ID, Nombre, Email } = response.data;

                if (error)
                    toast.error(error);

                if (message) {
                    toast.success(message);
                    var dt = new Date();
                    dt.setHours(dt.getHours() + 2);
                    cookies.set("id", ID, { path: "/", expires: dt });
                    cookies.set("name", Nombre, { path: "/", expires: dt });
                    cookies.set("email", Email, { path: "/", expires: dt });
                    window.location.href = "/planta";
                }
            }).catch(error => {
                console.log(error);
                toast.error("Ha ocurrido un error en la peticion");
            }).finally(() => this.setState({ loginLoad: false }));
        }
    }

    registerUser = () => {
        const { name, lastName, regEmail, regPassword } = this.state;
        this.setState({ registerLoad: true });
        if (name.trim().length === 0 || lastName.trim().length === 0 || regEmail.trim().length === 0 || regPassword.trim().length === 0) {
            toast.warning("Los campos no pueden quedar vacios")
        } else if (regPassword.length < 8) {
            toast.warning("La contraseña debe de tener minimo 8 caracteres")
        } else {
            axios.post("/api/users/register.php", { nombre: name, apellidos: lastName, email: regEmail, password: regPassword }).then(response => {
                //console.log(response.data);
                const { error, message } = response.data;
                if (error) {
                    toast.error(error);
                }
                if (message) {
                    toast.success(message)
                }
            }).catch(error => {
                console.log(error);
                toast.error("Ha ocurrido un error en la peticion");
            }).finally(() => this.setState({ registerLoad: false }));
        }
    }

    render() {
        return (
            <div className="container" style={{ marginTop: "5%" }}>
                <ToastContainer
                    autoClose={3000}
                    newestOnTop={false}
                    closeOnClick
                />
                <div className="row">
                    <div className="col col-xs-12 col-sm-12 col-md-6" style={{ marginTop: "16px" }}>
                        <h2>Iniciar sesion</h2>
                        <div className="login">
                            <form>
                                <div className="form-group" style={{ width: "80%" }}>
                                    <label style={{ margin: "4px" }} >Correo electronico</label>
                                    <input style={{ margin: "4px" }} type="email" className="form-control" placeholder="janedoe@example.com" name="email" onChange={this.handleChange} />

                                    <label style={{ margin: "4px" }}>Contraseña</label>
                                    <input style={{ margin: "4px" }} type="password" className="form-control" placeholder="**********" name="password" onChange={this.handleChange} />
                                    {
                                        this.state.loginLoad ? <div style={{ margin: "12px 4px" }} className="spinner-border text-secondary" role="status">
                                            <span style={{ margin: "12px 4px" }} className="visually-hidden">Loading...</span>
                                        </div> :
                                            <button style={{ margin: "12px 4px" }} type="button" className="btn btn-primary" onClick={this.loginUser}>Iniciar Sesion</button>
                                    }

                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col col-xs-12 col-sm-12 col-md-6" style={{ marginTop: "16px" }}>
                        <h2>Registro</h2>
                        <div className="register">
                            <form>
                                <div className="form-group" style={{ width: "80%" }}>
                                    <label style={{ margin: "4px" }}>Nombre</label>
                                    <input style={{ margin: "4px" }} type="text" className="form-control" name="name" placeholder="Jane" onChange={this.handleChange} />

                                    <label style={{ margin: "4px" }}>Apellidos</label>
                                    <input style={{ margin: "4px" }} type="text" className="form-control" name="lastName" placeholder="Doe" onChange={this.handleChange} />

                                    <label style={{ margin: "4px" }}>Correo electronico</label>
                                    <input style={{ margin: "4px" }} type="email" className="form-control" name="regEmail" placeholder="janedoe@example.com" onChange={this.handleChange} />

                                    <label style={{ margin: "4px" }}>Contraseña</label>
                                    <input style={{ margin: "4px" }} type="password" className="form-control" name="regPassword" placeholder="*********" onChange={this.handleChange} />
                                    {
                                        this.state.registerLoad ? <div style={{ margin: "12px 4px" }} className="spinner-border text-secondary" role="status">
                                            <span style={{ margin: "12px 4px" }} className="visually-hidden">Loading...</span>
                                        </div> : <button style={{ margin: "12px 4px" }} type="button" className="btn btn-primary" onClick={this.registerUser}>Registrar</button>
                                    }

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Usuario;