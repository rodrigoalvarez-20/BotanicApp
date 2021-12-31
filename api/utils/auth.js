import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

dotenv.config();

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.headers["Authorization"];

        const publicKey = fs.readFileSync(`${process.cwd()}/api/keys/public.pub`, "utf8");

        const decode = jwt.verify(token, publicKey);

        req.payload = decode;

        next();
    } catch (ex) {
        console.log(ex.message);
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Autenticacion fallida" });
    }
}

export { authUser }