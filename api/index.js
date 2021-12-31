import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.API_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});