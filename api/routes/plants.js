import StatusCodes from "http-status-codes";
import dotenv from "dotenv";
import { Router } from "express";
import DBConn from "../utils/db.js";
import { authUser } from "../utils/auth.js";
import multer from "multer";
import fs from "fs";

dotenv.config();

const PlantsRouter = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.cwd()}/api/images`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

PlantsRouter.get("/", authUser, (req, res) => {
    const { id } = req.payload;
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const searchUser = "SELECT plants.*, catalog.* FROM plants INNER JOIN catalog ON plants.id_planta = catalog.id_planta WHERE plants.id_persona = ?";

    connection.query(searchUser, [id], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al obtener la lista de plantas" });
        }
        connection.end();
        return res.status(StatusCodes.OK).json(results);
    });
});

const plantUpload = multer({ storage })


PlantsRouter.post("/", authUser, plantUpload.single("image"), (req, res) => {
    const { id } = req.payload;

    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const insertPlant = "INSERT INTO plants VALUES (0,?,?,?,?,?,?,?)";

    const { id_plant, fecha_plantacion, lugar_plantacion, estado_actual, dimension_actual } = req.body;
    var url_image = "";
    if (req.file)
        url_image = `/api/images/${req.file.originalname}`;

    connection.query(insertPlant, [id_plant, id, url_image, fecha_plantacion, lugar_plantacion, estado_actual, dimension_actual], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al agregar la planta" });
        }
        connection.end();
        return res.status(StatusCodes.CREATED).json({ "message": "Se ha añadido la planta" });
    });
});

PlantsRouter.patch("/", authUser, plantUpload.single("image"), (req, res) => {
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const updatePlant = "UPDATE plants SET id_planta = ?, url_imagen = ?, fecha_plantacion = ?, lugar_plantacion = ?, estado_actual = ?, dimension_actual = ? WHERE id = ?";

    //console.log(req.body);

    const { id, id_planta, fecha_plantacion, lugar_plantacion, estado_actual, dimension_actual } = req.body;
    var { url_imagen } = req.body;

    if (req.file)
        url_imagen = `/api/images/${req.file.originalname}`;

    connection.query(updatePlant, [id_planta, url_imagen, fecha_plantacion, lugar_plantacion, estado_actual, dimension_actual, id], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al actualizar la planta" });
        }
        connection.end();
        return res.status(StatusCodes.OK).json({ "message": "Se ha actualizado la planta" });
    });

})

PlantsRouter.delete("/", authUser, (req, res) => {
    const { id, image } = req.query;

    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const delPlant = "DELETE FROM plants WHERE id = ?";

    connection.query(delPlant, [id], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al eliminar la planta" });
        }
        connection.end();
        if(image)
            fs.unlinkSync(`${process.cwd()}${image}`);

        return res.status(StatusCodes.OK).json({ "message": "Se ha eliminado la planta" });
    });
    

});


export default PlantsRouter;