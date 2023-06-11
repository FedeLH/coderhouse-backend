import { Router } from "express";
import { sendMailTransport } from "../utils/nodemailer.js";
import { sendSms } from "../utils/sendSmsTwilio.js"
import { generateUser } from "../utils/faker.js";
import EErrors from "../utils/errors/EErrors.js";
import CustomError from "../utils/errors/CustomError.js"
import { generateUserErrorInfo } from "../utils/errors/info.js"

const router = Router();

router.get('/mail', async (req, res) => {
    try {
        await sendMailTransport()
        res.send('Email sended')
    } catch (error) {
        console.log(error)
    }
})

router.get('/sms', async (req, res) => {
    try {
        await sendSms()
        res.send('SMS sended')
    } catch (error) {
        console.log(error)
    }
})

router.get('/users', async (req, res) => {
    try {
        let users = []
        for (let i = 0; i < 100; i++) {
            users.push(generateUser())
        }
        res.send(users)
    } catch (error) {
        console.log(error)
    }
})

router.post('/user', async (req, res, next) => {
        try {
            const {first_name, last_name, email} = req.body;
            if (!first_name || !last_name || !email) {
                CustomError.createError({
                    name: "User creation error",
                    cause: generateUserErrorInfo({first_name,last_name,email}),
                    message: "Error trying to create user",
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }
            const user = {
                first_name,
                last_name,
                email
            }
            res.send({status: "success", payload: user})
        } catch (error) {
            next(error)
        }
 
})

export default router;
