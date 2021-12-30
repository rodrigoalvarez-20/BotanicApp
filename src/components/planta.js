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
        render: rowData => <img alt="PlantImage" src={`http://127.0.0.1:8000/api/images/${rowData.Imagen}`} style={{ width: 75, borderRadius: '50%' }}></img>
    },
    {
        title: 'Nombre',
        field: 'Nombre',
    },
    {
        title: 'Especie',
        field: 'Especie'
    },
    {
        title: 'Fecha de Plantacion',
        field: 'Fecha_Plantacion'
    },
    {
        title: 'Lugar de Plantacion',
        field: 'Lugar_Plantacion'
    },
    {
        title: 'Estado actual',
        field: 'Estado'
    },
    {
        title: 'Dimension actual',
        field: 'Dimension_Actual'
    }
];

const Planta = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
    };

    var defaultPlant = {
        ID: -1,
        ID_Planta: -1,
        Imagen: null,
        Fecha_Plantacion: new Date(),
        Lugar_Plantacion: "",
        Estado_Actual: "",
        Dimension_Actual: ""
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
        if (!cookies.get("id")) {
            window.location.href = "/";
        }
        axios.get(`/api/plants/list.php?id=${cookies.get("id")}`).then(response => {
            const { plants } = response.data;
            if (plants)
                setData(plants);
        }).catch(error => {
            console.log(error);
        }).then(async () => {
            const data = await axios.get("/api/catalog/all.php");
            const { plants } = data.data;
            //console.log(data.data);
            if (data) {
                setBaseModels(plants);
            }
        }).finally(() => setFetchDataStatus(false));

    }, []);


    const submitPlantForm = () => {
        const { ID_Planta, Imagen, Fecha_Plantacion, Lugar_Plantacion, Estado_Actual, Dimension_Actual } = actualPlant;

        //console.log(actualPlant)

        const usr_id = cookies.get("id");
        setMakingPetitionStatus(true);

        var data = new FormData();


        if (Imagen)
            data.append("image", Imagen);
        data.append("Fecha_Plantacion", new Date(Fecha_Plantacion).toISOString().split("T")[0]);
        data.append("Lugar", Lugar_Plantacion);
        data.append("Estado", Estado_Actual);
        data.append("Dimension", Dimension_Actual);
        if (actualOperation === "Añadir") {
            data.append("ID_Usr", parseInt(usr_id));
            data.append("ID_Plant", parseInt(ID_Planta));
            axios.post("/api/plants/add.php", data).then(response => {
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
        } else {
            data.append("ID", actualPlant.ID);
            axios.post("/api/plants/update.php", data).then(response => {
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

    function deletePlant(rowData) {
        const { ID, Imagen } = rowData;
        const data = new FormData();
        data.append("id", ID);
        data.append("image", Imagen)
        axios.post("/api/plants/delete.php", data).then(response => {
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
        });
    }

    const logout = () => {
        cookies.remove("id");
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
                            setActualPlant({ ...rowData, Estado_Actual: rowData["Estado"] });
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
                        <select className="form-select" name="ID_Planta" onChange={handleFormChange}
                            value={actualPlant.ID_Planta}>
                            <option value={-1} disabled></option>
                            {
                                models.map(model => <option key={model.ID} value={model.ID}>{model.Nombre} - {model.Tipo}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label className="form-label">Imagen</label>
                    <input style={{ width: "80%", marginLeft: "12px" }} className="form-control" type="file" onChange={(e) => setActualPlant({ ...actualPlant, "Imagen": e.target.files[0] })} />
                </div>

                <div className="mb-3 row">
                    <label className="form-label" htmlFor="datePicker">Fecha de plantacion</label>
                    <input style={{ width: "80%", marginLeft: "12px" }} className="form-control" type="date" id="datePicker"
                        onChange={handleFormChange}
                        name="Fecha_Plantacion"
                        value={actualPlant.Fecha_Plantacion}
                        min={new Date()} />
                </div>

                <div className="mb-3">
                    <label htmlFor="txtLugar" className="form-label">Lugar de plantacion</label>
                    <input type="text" className="form-control" id="txtDim" name="Lugar_Plantacion" onChange={handleFormChange} value={actualPlant.Lugar_Plantacion} />
                </div>

                <div className="mb-3">
                    <label htmlFor="txtEstado" className="form-label">Estado actual</label>
                    <input type="text" className="form-control" id="txtDim" name="Estado_Actual" onChange={handleFormChange} value={actualPlant.Estado_Actual} />
                </div>

                <div className="mb-3">
                    <label htmlFor="txtDim" className="form-label">Dimension Actual</label>
                    <input type="text" className="form-control" id="txtDim" name="Dimension_Actual" onChange={handleFormChange} value={actualPlant.Dimension_Actual} />
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
                <DialogTitle id="alert-dialog-title">{actualPlant.Nombre}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <img alt="plantImage" style={{ display: "flex", margin: "auto" }} src={`http://127.0.0.1:8000/api/images/${actualPlant.Imagen}`} width="120" />
                        <p>Especie: {actualPlant.Especie}</p>
                        <p>Tipo: {actualPlant.Tipo}</p>
                        <p>Descripcion: {actualPlant.Descripcion}</p>
                        <p>Estado: {actualPlant.Estado} </p>
                        <p>Dimension Inicial: {actualPlant.Dimension_Inicial}  - Dimension Actual: {actualPlant.Dimension_Actual}</p>
                        <p>Fecha de plantacion: {actualPlant.Fecha_Plantacion}</p>
                        <p>Lugar de plantacion: {actualPlant.Lugar_Plantacion}</p>
                        <p>Tipo de tierra: {actualPlant.Tipo_Tierra}</p>
                        <p>Tipo de luz: {actualPlant.Tipo_Luz}</p>
                        <p>Cuidados: {actualPlant.Cuidados_Necesarios}</p>
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