import { Application } from "express";
import apiRoute from "./apis/index";

const init = (server: Application) => {
    server.get("*", (req, res, next) =>  {
        return next();
    });

    server.use("/api", apiRoute);
};

export default {
    init: init
}