import { Request, Response, NextFunction } from "express";
import { ResponseModel } from "../../models/response";
import jwt from "jsonwebtoken";
import User from "../../models/user";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({})
            .select("_id name surname username email");

        if (users.length > 0) {
            return res.status(200).send(
                ResponseModel.success(users)
            );
        }

        return res.status(404).send(
            ResponseModel.error("bad request")
        );
    } catch (err) {
        return res.status(500).send(
            ResponseModel.error("server error, try again later")
        );
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const token = req.headers.authorization.split(' ')[1];

        if (token !== undefined) {
            jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(
                        ResponseModel.error(err.message)
                    );
                }

                User.findOne({ _id: id })
                    .select("_id name surname username email")
                    .exec((err, user) => {
                        if (err) {
                            return res.status(500).send(
                                ResponseModel.error("an error occurred")
                            );
                        }

                        if (!user) {
                            return res.status(404).send(
                                ResponseModel.error("no user found")
                            );
                        }

                        res.status(200).send(
                            ResponseModel.success(user)
                        );
                    });
            });
        } else {
            res.status(500).send(
                ResponseModel.error("token not sent")
            )
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(
            ResponseModel.error("token not sent, try again later")
        );
    }
}

export default {
    getUsers: getUsers,
    getUserById: getUserById
}