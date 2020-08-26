import server from "./configs/app";
import config from "./configs/config/config";
import db from "./configs/db";

server.create(config, db);

server.start();