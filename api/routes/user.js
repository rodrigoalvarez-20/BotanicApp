import StatusCodes from "http-status-codes";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Router } from "express";
import DBConn from "../utils/db.js";
import jwt from "jsonwebtoken";
import fs from "fs";

dotenv.config();

const UserRouter = Router();


UserRouter.post("/login", (req, res) => {
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const { email, password } = req.body;

    const searchUser = "SELECT * FROM users WHERE email = ?";

    connection.query(searchUser, [email], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al validar el usuario" });
        }

        if (results.length === 0) {
            connection.end();
            return res.status(StatusCodes.NOT_FOUND).json({ "error": "Las credenciales son incorrectas" });
        }

        const usrPwd = results[0].password;

        if (!bcrypt.compareSync(password, usrPwd)) {
            connection.end();
            return res.status(StatusCodes.BAD_REQUEST).json({ "error": "Las credenciales son incorrectas" })
        }

        const { id, nombre, apellidos, email } = results[0];

        const privateKey = fs.readFileSync(`${process.cwd()}/api/keys/private.key`, "utf8");
        const token = jwt.sign({ id, nombre, email }, privateKey, { algorithm: "RS256" });

        if (!token) {
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al generar la token" });
        } else {
            connection.end();
            return res.status(StatusCodes.OK).json({ "message": "Bienvenido de regreso", "token": token, nombre, email, apellidos });
        }
    });
});


UserRouter.post("/register", async (req, res) => {
    const connection = new DBConn().getConnection();

    connection.connect((err) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error en el servidor" });
        }
    });

    const { nombre, apellidos, email, password } = req.body;

    const pwdHashed = bcrypt.hashSync(password, 12);

    if (!pwdHashed) {
        connection.end();
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al cifrar la contraseña" });
    }

    const searchUser = "SELECT * FROM users WHERE email = ?";

    connection.query(searchUser, [email], (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al validar el usuario" });
        }
        if (results.length > 0) {
            connection.end();
            return res.status(StatusCodes.BAD_REQUEST).json({ "error": "El usuario ya se ha registrado" });
        }

        const insQuery = "INSERT INTO users VALUES (0,?,?,?,?)";

        connection.query(insQuery, [nombre, apellidos, email, pwdHashed], (insErr, insRes) => {
            if (insErr) {
                console.log(insErr);
                connection.end();
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "error": "Ha ocurrido un error al crear el usuario" });
            }
            connection.end();
            return res.status(StatusCodes.CREATED).json({ "message": "Se ha creado correctamente el usuario" });
        });

    });
});


export default UserRouter;