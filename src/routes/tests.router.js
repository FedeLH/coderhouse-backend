import { Router } from "express";
import { sendMailTransport } from "../utils/nodemailer.js";
import { sendSms } from "../utils/sendSmsTwilio.js"
import { generateUser } from "../utils/faker.js";

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

export default router;
