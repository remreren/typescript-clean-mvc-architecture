import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

require("dotenv").config(); // set env

export default () => {
    const server = express();

    const create = (config, db) => {
        const routes = require("../routes");

        server.set('env', config.env);
        server.set('port', config.port || 3000);
        server.set('hostname', config.hostname);

        server.use(bodyParser.json({ limit: "2mb" }));
        server.use(bodyParser.urlencoded({ extended: false, limit: "2mb" }));
        server.use(cors())

        if (process.env.NODE_ENV !== "production") {
            server.use(morgan("dev"));
        }

        mongoose.connect(
            db.database,
            {
                useNewUrlParser: true,
                useCreateIndex: true
            }
        )

        routes.init(server);
    };

    const start = () => {
        const hostname = server.get('hostname');
        const port = server.get('port');

        server.listen(port, () => {
            console.log(`Server is listening to https://${hostname}:${port}`);
        });
    };

    return {
        create: create,
        start: start
    }
};