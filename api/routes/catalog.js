import StatusCodes from "http-status-codes";
import dotenv from "dotenv";
import { Router } from "express";
import DBConn from "../utils/db.js";
import { authUser } from "../utils/auth.js";

dotenv.config();

const CatalogRouter = Router();

CatalogRouter.get("/", authUser, (req, res) => {
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const modelsQuery = "SELECT * FROM catalog";

    connection.query(modelsQuery, null, (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al obtener la lista de modelos" });
        }
        connection.end();
        return res.status(StatusCodes.OK).json(results);
    });
});

CatalogRouter.post("/", authUser, (req, res) => {
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const insertModel = "INSERT INTO catalog VALUES (0,?,?,?,?,?,?,?,?)";
    const { nombre, especie, tipo, descripcion, dimension, tierra, luz, cuidados } = req.body;
    connection.query(insertModel, [nombre, especie, tipo, descripcion, dimension, tierra, luz, cuidados], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al crear el modelo" });
        }
        connection.end();
        return res.status(StatusCodes.OK).json({ "message": "Se ha creado el modelo" });
    });
});

CatalogRouter.patch("/", authUser, (req, res) => {
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const updateModel = "UPDATE catalog SET nombre = ?, especie = ?, tipo = ?, descripcion = ?, dimension_inicial = ?, tipo_tierra = ?, tipo_luz = ?, cuidados_necesarios = ? WHERE id_planta = ?";
    console.log(req.body);
    const { id_planta, nombre, especie, tipo, descripcion, dimension, tierra, luz, cuidados } = req.body;
    connection.query(updateModel, [nombre, especie, tipo, descripcion, dimension, tierra, luz, cuidados, id_planta], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al actualizar el modelo" });
        }
        connection.end();
        return res.status(StatusCodes.OK).json({ "message": "Se ha actualizado el modelo" });
    });
});


export default CatalogRouter;