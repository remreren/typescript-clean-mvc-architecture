import { Request, Response, NextFunction } from "express";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            surname,
            username,
            email,
            password
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

        if (password == undefined || password == "") {
            return res.status(422).send({
                message: "password not sent",
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
            username: username,
            password: bcrypt.hashSync(password, 8)
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

const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (email == undefined || email == "") {
            return res.status(422).send({
                message: "email not sent",
                data: null
            });
        }

        if (password == undefined || password == "") {
            return res.status(422).send({
                message: "password not sent",
                data: null
            });
        }

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(404).send({
                message: "email is not existing",
                data: null
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(
            password,
            user.toObject().password
        );

        if (!isPasswordCorrect) {
            return res.status(401).send({
                message: "password invalid",
                data: null
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: 86400 });

        res.status(200).send({
            message: null,
            data: {
                id: user._id,
                accessToken: token
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "something went wrong, try again later",
            data: err
        });
    }
}

export default {
    signup: signup,
    signin: signin
}