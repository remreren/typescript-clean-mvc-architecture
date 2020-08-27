import server from "./configs/app";
import dot from "dotenv";

if (process.env.NODE_ENV !== "production") {
    const result = dot.config();
    console.log(result.parsed);
    if (result.error) {
        console.log("error parsing production");
        throw result.error;
    }
}

import config from "./configs/config/config";
import db from "./configs/db";

server.create(config, db);

server.start();