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
        req.logger.error(error)
    }
})

router.get('/sms', async (req, res) => {
    try {
        await sendSms()
        res.send('SMS sended')
    } catch (error) {
        req.logger.error(error)
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
        req.logger.error(error)
    }
})

router.get('/sencilla', (req, res) => {
    let sum = 0;
    for (let i =0; i < 1000000; i++) {
        sum += i
    }
    res.send(`This response comes from the worker: ${process.pid}, respuesta: ${sum}`)
})

router.get('/compleja', (req, res) => {
    let sum = 0;
    for (let i =0; i < 5e8; i++) {
        sum += i
    }
    res.send(`This response comes from the worker: ${process.pid}, respuesta: ${sum}`)
})

export default router;
