import { Request, Response, NextFunction } from "express";
import User from "../../models/user";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({});

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

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            surname,
            username,
            email
        } = req.body;

        if (name == undefined || name == "") {
            return res.status(422).send({
                message: "first name not sent",
                data: null
            });
        }

        if (surname == undefined || surname == "") {
            return res.status(422).send({
                message: "last name not sent",
                data: null
            });
        }

        if (username == undefined || username == "") {
            return res.status(422).send({
                message: "username not sent",
                data: null
            });
        }

        if (email == undefined || email == "") {
            return res.status(422).send({
                message: "email not sent",
                data: null
            });
        }

        const isEmailExists = await User.findOne({
            email: email
        });

        if (isEmailExists) {
            return res.status(409).send({
                message: "email already exists",
                data: null
            });
        }

        const isUsernameExists = await User.findOne({
            username: username
        });

        if (isUsernameExists) {
            return res.status(409).send({
                message: "username already exists",
                data: null
            });
        }

        const temp = {
            name: name,
            surname: surname,
            email: email,
            username: username
        }

        const newUser = await User.create(temp);

        if (newUser) {
            return res.status(201).send({
                message: 'user created successfully',
                data: newUser
            });
        } else {
            res.status(500).send({
                message: "something went wrong, try again later",
                data: null
            });
            throw new Error('something went wrong');
        }
    } catch (err) {
        res.status(500).send({
            message: "something went wrong, try again later",
            data: err
        });
    }
}

export default {
    getUsers: getUsers,
    createUser: createUser
}