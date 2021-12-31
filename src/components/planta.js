import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import NavigationBar from './navbar';

import Lottie from 'react-lottie';
import * as animationData from '../assets/empty.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Delete, LocalFlorist } from '@material-ui/icons';
import axios from 'axios';
import Cookies from 'universal-cookie';
import MaterialTable from 'material-table';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const cookies = new Cookies();

const columnas = [

    {
        title: 'Imagen',
        field: 'url_imagen',
        render: rowData => <img alt="Imagen_Planta" src={`${rowData.url_imagen}`} style={{ width: 75, borderRadius: '20%' }}></img>
    },
    {
        title: 'Nombre',
        field: 'nombre',
    },
    {
        title: 'Especie',
        field: 'especie'
    },
    {
        title: 'Fecha de Plantacion',
        field: 'fecha_plantacion'
    },
    {
        title: 'Lugar de Plantacion',
        field: 'lugar_plantacion'
    },
    {
        title: 'Estado actual',
        field: 'estado_actual'
    },
    {
        title: 'Dimension actual',
        field: 'dimension_actual'
    }
];

const Planta = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
    };

    var defaultPlant = {
        id: -1,
        id_planta: -1,
        imagen: null,
        url_imagen: "",
        especie: "",
        tipo: "",
        descripcion: "",
        fecha_plantacion: new Date(),
        lugar_plantacion: "",
        estado_actual: "",
        dimension_actual: "",
        dimension_inicial: "",
        tipo_tierra: "",
        tipo_luz: "",
        cuidados_necesarios: ""
    };

    const [fetchData, setFetchDataStatus] = useState(true);
    const [data, setData] = useState([]);
    const [displayPlantForm, setDisplayPlantForm] = useState(false);
    const [actualPlant, setActualPlant] = useState(defaultPlant);
    const [actualOperation, setActualOperation] = useState("Añadir");
    const [models, setBaseModels] = useState([]);
    const [isMakingPetition, setMakingPetitionStatus] = useState(false);
    const [displayModal, setDisplayModalStatus] = useState(false);

    useEffect(() => {
        if (!cookies.get("token")) {
            window.location.href = "/";
        }
        axios.get(`/api/plants`, { headers: { "Authorization": cookies.get("token") } }).then(response => {
            //const { plants } = response.data;
            console.log(response.data);
            //if (plants)
            setData(response.data);
        }).catch(error => {
            console.log(error);
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            } else
                toast.error("Ha ocurrido un error en la peticion");
        }).then(async () => {
            try {
                const data = await axios.get("/api/catalog", { headers: { "Authorization": cookies.get("token") } });
                console.log(data.data);
                setBaseModels(data.data);
            } catch (ex) {
                console.log(ex);
                if (ex.response.data.error) {
                    toast.error(ex.response.data.error);
                } else
                    toast.error("Ha ocurrido un error en la peticion");
            }

        }).finally(() => setFetchDataStatus(false));

    }, []);


    const submitPlantForm = () => {
        const { id_planta, imagen, fecha_plantacion, lugar_plantacion, estado_actual, dimension_actual } = actualPlant;
        setMakingPetitionStatus(true);
        var data = new FormData();
        if (imagen)
            data.append("image", imagen);
        data.append("fecha_plantacion", new Date(fecha_plantacion).toISOString().split("T")[0]);
        data.append("lugar_plantacion", lugar_plantacion);
        data.append("estado_actual", estado_actual);
        data.append("dimension_actual", dimension_actual);
        if (actualOperation === "Añadir") {
            //data.append("id_", parseInt(usr_id));
            data.append("id_plant", parseInt(id_planta));
            axios.post("/api/plants", data, { headers: { "Authorization": cookies.get("token") } }).then(response => {
                const { message } = response.data;
                //console.log(response.data)
                if (message) {
                    toast.success(message);
                    setTimeout(() => { }, 5000);
                    window.location.reload();
                }
            }).catch(error => {
                console.log(error);
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                } else
                    toast.error("Ha ocurrido un error en la peticion");
            }).finally(() => { setMakingPetitionStatus(false) });
        } else {
            data.append("id", actualPlant.id);
            data.append("id_planta", actualPlant.id_planta);
            data.append("url_imagen", actualPlant.url_imagen);
            axios.patch("/api/plants", data, { headers: { "Authorization": cookies.get("token") } }).then(response => {
                const { message } = response.data;
                //console.log(response.data)
                if (message) {
                    toast.success(message);
                    setTimeout(() => { }, 5000);
                    window.location.reload();
                }
            }).catch(error => {
                console.log(error);
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                } else
                    toast.error("Ha ocurrido un error en la peticion");
            }).finally(() => { setMakingPetitionStatus(false) });
        }

    }

    function deletePlant(rowData) {
        const { id, url_imagen } = rowData;
        axios.delete(`/api/plants?id=${id}&image=${url_imagen}`, { headers: { "Authorization": cookies.get("token") } }).then(response => {
            const { message } = response.data;
            //console.log(response.data)
            if (message) {
                toast.success(message);
                setTimeout(() => { }, 5000);
                window.location.reload();
            }
        }).catch(error => {
            console.log(error);
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            } else
                toast.error("Ha ocurrido un error en la peticion");
        });
    }

    const logout = () => {
        cookies.remove("token");
        cookies.remove("name");
        cookies.remove("email");
        window.location.href = "/";
    }

    const tooglePlantForm = () => {
        if (displayPlantForm) {
            //Limpiar campos, ya que se va a esconder
            setActualPlant(defaultPlant);
        }

        if (actualOperation !== "Añadir") {
            setActualPlant(defaultPlant);
            setActualOperation("Añadir")
        }


        setDisplayPlantForm(!displayPlantForm);
    }

    const handleFormChange = (e) => {
        setActualPlant({
            ...actualPlant,
            [[e.target.name]]: e.target.value
        });
    }

    function renderFetchIndicator() {
        return (
            <div style={{ margin: "auto", display: "flex", marginTop: "5%" }} className="spinner-border text-primary" role="status">
                <span style={{ margin: "12px 4px" }} className="visually-hidden">Loading...</span>
            </div>)
    }

    function renderPlantsTable() {
        return <div style={{ marginTop: "24px" }}>
            <MaterialTable
                columns={columnas}
                data={data}
                title="Plantas"
                actions={[
                    {
                        icon: LocalFlorist,
                        tooltip: 'Ver planta',
                        onClick: (event, rowData) => {
                            //console.log("Display");
                            setActualPlant({ ...rowData, estado_actual: rowData["estado_actual"] });
                            setDisplayModalStatus(true);
                        }
                    },
                    {
                        icon: Edit,
                        tooltip: 'Editar planta',
                        onClick: (event, rowData) => {
                            //console.log(rowData)
                            setActualPlant({ ...rowData, Estado_Actual: rowData["Estado"] });
                            setActualOperation("Editar");
                            setDisplayPlantForm(true)
                        }
                    },
                    {
                        icon: Delete,
                        tooltip: 'Eliminar planta',
                        onClick: (e, rw) => deletePlant(rw)
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

    function renderEmptyMessage() {
        return (
            <div style={{ margin: "24px 0px", textAlign: "center" }}>
                <p className="text-black-50">Aun no hay plantas en tu perfil...</p>
                <Lottie options={defaultOptions}

                    width={200} />
            </div>
        )
    }

    function renderPlantForm() {
        return (
            <div style={{ margin: "12px" }}>
                <p style={{ fontSize: "18pt" }} className="text-success">{actualOperation} planta</p>
                <div className="mb-3 row">
                    <label htmlFor="dwModel" className="col-sm-12 col-md-3 col-form-label">Modelo de planta</label>
                    <div className="col-sm-12 col-md-9">
                        <select className="form-select" name="id_planta" onChange={handleFormChange}
                            value={actualPlant.id_planta}>
                            <option value={-1} disabled></option>
                            {
                                models.map(model => <option key={model.id_planta} value={model.id_planta}>{model.nombre} - {model.tipo}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label className="form-label">Imagen</label>
                    <input style={{ width: "80%", marginLeft: "12px" }} className="form-control" type="file" onChange={(e) => setActualPlant({ ...actualPlant, "imagen": e.target.files[0] })} />
                </div>

                <div className="mb-3 row">
                    <label className="form-label" htmlFor="datePicker">Fecha de plantacion</label>
                    <input style={{ width: "80%", marginLeft: "12px" }} className="form-control" type="date" id="datePicker"
                        onChange={handleFormChange}
                        name="fecha_plantacion"
                        value={actualPlant.fecha_plantacion}
                        min={new Date()} />
                </div>

                <div className="mb-3">
                    <label htmlFor="txtLugar" className="form-label">Lugar de plantacion</label>
                    <input type="text" className="form-control" id="txtDim" name="lugar_plantacion" onChange={handleFormChange} value={actualPlant.lugar_plantacion} />
                </div>

                <div className="mb-3">
                    <label htmlFor="txtEstado" className="form-label">Estado actual</label>
                    <input type="text" className="form-control" id="txtDim" name="estado_actual" onChange={handleFormChange} value={actualPlant.estado_actual} />
                </div>

                <div className="mb-3">
                    <label htmlFor="txtDim" className="form-label">Dimension Actual</label>
                    <input type="text" className="form-control" id="txtDim" name="dimension_actual" onChange={handleFormChange} value={actualPlant.dimension_actual} />
                </div>

                <div className="mb-3 row" style={{ textAlign: "center" }}>
                    <div className="col col-xs-12 col-sm-2">
                        <button className="btn btn-outline-danger" onClick={tooglePlantForm}>Cancelar</button>
                    </div>
                    <div className="col col-xs-12 col-sm-2">
                        {
                            isMakingPetition ? <div style={{ margin: "auto", display: "flex", marginTop: "5%" }} className="spinner-border text-primary" role="status">
                                <span style={{ margin: "12px 4px" }} className="visually-hidden">Loading...</span>
                            </div> : <button className="btn btn-outline-success" onClick={submitPlantForm}>Aceptar</button>
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
                    <button className="btn btn-outline-info" onClick={tooglePlantForm} >Añadir Planta</button>
                    {
                        displayPlantForm ? renderPlantForm() : null
                    }
                    {
                        data.length > 0 ? renderPlantsTable() : renderEmptyMessage()
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
                <DialogTitle id="alert-dialog-title">{actualPlant.nombre}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <img alt="plantImage" style={{ display: "flex", margin: "auto", maxWidth: "25%", marginBottom: "12px" }} src={`${actualPlant.url_imagen}`} />
                        <p>Especie: {actualPlant.especie}</p>
                        <p>Tipo: {actualPlant.tipo}</p>
                        <p>Descripcion: {actualPlant.descripcion}</p>
                        <p>Estado: {actualPlant.estado_actual} </p>
                        <p>Dimension Inicial: {actualPlant.dimension_inicial}  - Dimension Actual: {actualPlant.dimension_actual}</p>
                        <p>Fecha de plantacion: {actualPlant.fecha_plantacion}</p>
                        <p>Lugar de plantacion: {actualPlant.lugar_plantacion}</p>
                        <p>Tipo de tierra: {actualPlant.tipo_tierra}</p>
                        <p>Tipo de luz: {actualPlant.tipo_luz}</p>
                        <p>Cuidados: {actualPlant.cuidados_necesarios}</p>
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
                fetchData ? renderFetchIndicator() : renderContent()
            }
            {
                infoModal()
            }
        </div>

    )
}

export default Planta;