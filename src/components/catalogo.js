import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import NavigationBar from './navbar';
import Lottie from 'react-lottie';
import * as animationData from '../assets/empty.json';
import { Edit, LocalFlorist } from '@material-ui/icons';

import MaterialTable from 'material-table';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

const columnas = [
    {
        title: 'Nombre',
        field: 'Nombre'
    },
    {
        title: 'Especie',
        field: 'Especie'
    }, {
        title: 'Tipo',
        field: 'Tipo'
    },
    {
        title: 'Dimension inicial',
        field: 'Dimension_Inicial'
    },
    {
        title: 'Tipo de tierra',
        field: 'Tipo_Tierra'
    },
    {
        title: 'Tipo de luz',
        field: 'Tipo_Luz'
    }
];

const Catalogo = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
    };

    const defaultModel = {
        ID: -1,
        Nombre: "",
        Especie: "",
        Tipo: "",
        Descripcion: "",
        Dimension: "",
        Tierra: "",
        Luz: "",
        Cuidados: ""
    }

    const [models, setModels] = useState([]);
    const [isFetchingData, setFetchingDataStatus] = useState(true);
    const [displayModelForm, setDisplayModelForm] = useState(false);
    const [actualOperation, setActualOperation] = useState("Añadir");
    const [actualModel, setActualModel] = useState(defaultModel);
    const [isMakingPetition, setMakingPetitionStatus] = useState(false);
    const [displayModal, setDisplayModalStatus] = useState(false);

    useEffect(() => {
        if (!cookies.get("id")) {
            window.location.href = "/";
        }
        axios.get("/api/catalog/all.php").then(response => {
            const { plants } = response.data;
            if (plants)
                setModels(plants);
        }).catch(error => {
            console.log(error);
            toast.error("Ha ocurrido un error en la peticion");
        }).finally(() => setFetchingDataStatus(false));

    }, []);

    const toogleModelForm = () => {
        if (displayModelForm) {
            //Limpiar campos, ya que se va a esconder
            setActualModel(defaultModel);
        }

        if (actualOperation !== "Añadir") {
            setActualModel(defaultModel);
            setActualOperation("Añadir")
        }


        setDisplayModelForm(!displayModelForm);
    }

    const handleFormChange = (e) => {
        setActualModel({
            ...actualModel,
            [[e.target.name]]: e.target.value
        });
    }

    const submitModelForm = () => {
        const { ID, Nombre, Especie, Tipo, Descripcion, Dimension, Tierra, Luz, Cuidados } = actualModel;

        var data = new FormData();

        setMakingPetitionStatus(true);

        data.append("nombre", Nombre);
        data.append("especie", Especie);
        data.append("tipo", Tipo);
        data.append("descripcion", Descripcion);
        data.append("dimension", Dimension);
        data.append("tierra", Tierra);
        data.append("luz", Luz);
        data.append("cuidados", Cuidados);

        if (actualOperation === "Añadir") {
            axios.post("/api/catalog/add.php", data).then(response => {
                const { error, message } = response.data;
                //console.log(response.data)
                if (error)
                    toast.warning(error);
                if (message) {
                    toast.success(message);
                    setTimeout(() => { }, 5000);
                    window.location.reload();
                }
            }).catch(error => {
                console.log(error);
                toast.error("Ha ocurrido un error en la peticion");
            }).finally(() => { setMakingPetitionStatus(false) });
        } else if (actualOperation === "Editar") {
            data.append("id", ID);
            axios.post(`/api/catalog/update.php`, data).then(response => {
                const { error, message } = response.data;
                //console.log(response.data)
                if (error)
                    toast.warning(error);
                if (message) {
                    toast.success(message);
                    setTimeout(() => { }, 5000);
                    window.location.reload();
                }
            }).catch(error => {
                console.log(error);
                toast.error("Ha ocurrido un error en la peticion");
            }).finally(() => { setMakingPetitionStatus(false) });
        }
    }

    const logout = () => {
        cookies.remove("id");
        cookies.remove("name");
        cookies.remove("email");
        window.location.href = "/";
    }

    function renderEmptyMessage() {
        return (
            <div style={{ margin: "24px 0px", textAlign: "center" }}>
                <p className="text-black-50">Aun no hay modelos registrados...</p>
                <Lottie options={defaultOptions}

                    width={200} />
            </div>
        )
    }

    function renderModelsTable() {
        return <div style={{ marginTop: "24px" }}>
            <MaterialTable
                columns={columnas}
                data={models}
                title="Modelos de plantas"
                actions={[
                    {
                        icon: LocalFlorist,
                        tooltip: 'Ver modelo',
                        onClick: (event, rowData) => {
                            //console.log(rowData)
                            setActualModel({ ...rowData, Dimension: rowData["Dimension_Inicial"], Tierra: rowData["Tipo_Tierra"], Luz: rowData["Tipo_Luz"], Cuidados: rowData["Cuidados_Necesarios"] });
                            setDisplayModalStatus(true);
                        }
                    },
                    {
                        icon: Edit,
                        tooltip: 'Editar planta',
                        onClick: (event, rowData) => {
                            //console.log(rowData)
                            setActualModel({ ...rowData, Dimension: rowData["Dimension_Inicial"], Tierra: rowData["Tipo_Tierra"], Luz: rowData["Tipo_Luz"], Cuidados: rowData["Cuidados_Necesarios"] });
                            setActualOperation("Editar");
                            setDisplayModelForm(true)
                        }
                    }
                ]}
                onChangePage={() => { }}
                onChangeRowsPerPage={() => { }}
                options={{
                    actionsColumnIndex: -1,
                    search: false,
                    paging: false
                }}
                localization={{
                    header: {
                        actions: "Acciones"
                    }
                }}
            />
        </div>
    }

    function renderFetchIndicator() {
        return (
            <div style={{ margin: "auto", display: "flex", marginTop: "5%" }} className="spinner-border text-primary" role="status">
                <span style={{ margin: "12px 4px" }} className="visually-hidden">Loading...</span>
            </div>)
    }

    function renderModelForm() {

        return (
            <div style={{ margin: "12px" }}>
                <p style={{ fontSize: "18pt" }} className="text-success">{actualOperation} modelo</p>
                {
                    Object.keys(actualModel).map((key, idx) => {
                        if (key !== "ID" && key !== "tableData" && !key.includes("_"))
                            return (
                                <div key={idx} className="mb-3">
                                    <label htmlFor={`txt${key}`} className="form-label">{key}</label>
                                    <input type="text" className="form-control" id={`txt${key}`} name={key} onChange={handleFormChange} value={actualModel[key]} />
                                </div>
                            )
                    })
                }
                <div className="mb-3 row" style={{ textAlign: "center" }}>
                    <div className="col col-xs-12 col-sm-2">
                        <button className="btn btn-outline-danger" onClick={toogleModelForm}>Cancelar</button>
                    </div>
                    <div className="col col-xs-12 col-sm-2">
                        {
                            isMakingPetition ? <div style={{ margin: "auto", display: "flex", marginTop: "5%" }} className="spinner-border text-primary" role="status">
                                <span style={{ margin: "12px 4px" }} className="visually-hidden">Loading...</span>
                            </div> : <button className="btn btn-outline-success" onClick={submitModelForm}>Aceptar</button>
                        }

                    </div>

                </div>
            </div>
        )
    }

    function renderContent() {
        return (
            <div>
                <NavigationBar logout={logout} />
                <div style={{ margin: "2%" }}>
                    <button className="btn btn-outline-info" onClick={toogleModelForm} >Añadir Modelo</button>
                    {
                        displayModelForm ? renderModelForm() : null
                    }
                    {
                        models.length > 0 ? renderModelsTable() : renderEmptyMessage()
                    }

                </div>

            </div>
        )
    }

    function infoModal() {
        return (
            <Dialog
                open={displayModal}
                fullWidth={true}
                onClose={() => setDisplayModalStatus(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"md"}
            >
                <DialogTitle id="alert-dialog-title">{actualModel.Nombre}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>Especie: {actualModel.Especie}</p>
                        <p>Tipo: {actualModel.Tipo}</p>
                        <p>Descripcion: {actualModel.Descripcion}</p>
                        <p>Dimension Inicial: {actualModel.Dimension}</p>
                        <p>Tipo de tierra: {actualModel.Tierra}</p>
                        <p>Tipo de luz: {actualModel.Luz}</p>
                        <p>Cuidados: {actualModel.Cuidados}</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisplayModalStatus(false)} color="primary" autoFocus>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <div className="container">
            <ToastContainer
                autoClose={3000}
                newestOnTop={false}
                closeOnClick
            />
            {
                isFetchingData ? renderFetchIndicator() : renderContent()
            }
            {
                infoModal()
            }
        </div>

    )



}

export default Catalogo;