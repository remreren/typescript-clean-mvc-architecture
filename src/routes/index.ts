import { Application } from "express";

const apiRoute = require("./apis");

const init = (server: Application) => {
    server.get("*", (req, res, next) =>  {
        console.log(`Request made to ${req.originalUrl}`);
        return next();
    });

    server.use("/api", apiRoute);
};

export default {
    init: init
}