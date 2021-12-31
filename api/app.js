import morgan from "morgan";
import StatusCodes from "http-status-codes";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import DBConn from "./utils/db.js";

import UserRouter from "./routes/user.js";
import PlantsRouter from "./routes/plants.js";
import CatalogRouter from "./routes/catalog.js";

dotenv.config()

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/images", express.static(`${process.cwd()}/api/images`));


app.get("/api", (req, res) => {

    var connection = new DBConn().getConnection();
    
    connection.connect(err => {
        if(err){
            console.warn(err);
        }
    });

    console.log("Conexion a DB correcta");

    connection.end(() => {});

    return res.status(StatusCodes.OK).json({ message: "Api correcta." });
});

app.use("/api/users", UserRouter);
app.use("/api/plants", PlantsRouter);
app.use("/api/catalog", CatalogRouter);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        return res.status(StatusCodes.OK).json({});
    }
    next();
});

export default app;
