import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({})
            .select("_id name surname username email");

        if (users.length > 0) {
            return res.status(200).send({
                message: "users fetched successfully",
                data: users
            });
        }

        return res.status(404).send({
            message: "bad request",
            data: null
        });
    } catch (err) {
        return res.status(500).send({
            message: "server error, try again later",
            data: null
        });
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const token = req.headers.authorization;

        if (token !== undefined) {
            console.log(token);
            jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
                res.status(200).send(data);
            });
        } else {
            res.status(500).send({
                message: "token not sent"
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "server error, try again later",
            data: null
        });
    }
}

export default {
    getUsers: getUsers,
    getUserById: getUserById
}