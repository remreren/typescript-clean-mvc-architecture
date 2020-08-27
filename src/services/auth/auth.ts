import { Request, Response, NextFunction } from "express";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResponseModel } from "../../models/response";

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
            return res.status(422).send(
                ResponseModel.error("first name not sent")
            );
        }

        if (surname == undefined || surname == "") {
            return res.status(422).send(
                ResponseModel.error("last name not sent")
            );
        }

        if (username == undefined || username == "") {
            return res.status(422).send(
                ResponseModel.error("username not sent")
            );
        }

        if (email == undefined || email == "") {
            return res.status(422).send(
                ResponseModel.error("email not sent")
            );
        }

        if (password == undefined || password == "") {
            return res.status(422).send(
                ResponseModel.error("password not sent")
            );
        }

        const isEmailExists = await User.findOne({
            email: email
        });

        if (isEmailExists) {
            return res.status(409).send(
                ResponseModel.error("email already exists")
            );
        }

        const isUsernameExists = await User.findOne({
            username: username
        });

        if (isUsernameExists) {
            return res.status(409).send(
                ResponseModel.error("username already")
            );
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
            return res.status(201).send(
                ResponseModel.success(newUser)
            );
        } else {
            res.status(500).send(
                ResponseModel.error("something went wrong, try again later")
            );
            throw new Error('something went wrong');
        }
    } catch (err) {
        res.status(500).send(
            ResponseModel.error("something went wrong, try again later")
        );
    }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (email == undefined || email == "") {
            return res.status(422).send(
                ResponseModel.error("email not sent")
            );
        }

        if (password == undefined || password == "") {
            return res.status(422).send(
                ResponseModel.error("password not sent")
            );
        }

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(404).send(
                ResponseModel.error("email not existing")
            );
        }

        const isPasswordCorrect = bcrypt.compareSync(
            password,
            user.toObject().password
        );

        if (!isPasswordCorrect) {
            return res.status(401).send(
                ResponseModel.error("password invalid")
            );
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: 86400 });

        res.status(200).send(
            ResponseModel.success({
                id: user._id,
                accessToken: token
            })
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send(
            ResponseModel.error("something went wrong, try again later")
        );
    }
}

export default {
    signup: signup,
    signin: signin
}