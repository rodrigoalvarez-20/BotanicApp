import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config()

class DBConn {

    connection = null;
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB
        });
    }

    getConnection(){
        return this.connection;
    }


}

export default DBConn;