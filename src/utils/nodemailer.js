import { createTransport } from "nodemailer";
import { GMAIL_MAIL_USER, GMAIL_PASS } from "../config/config.js";
import __dirname from "./utils.js";
import path from "path";

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: GMAIL_MAIL_USER,
        pass: GMAIL_PASS
    }
})

export const sendMailTransport = async () => {
    transport.sendMail({
        from: `Coder test <${GMAIL_MAIL_USER}>`,
        to: 'sofiacardella5@gmail.com',
        subject: 'Correo de prueba',
        html: `
            <div>
                <h1>Mensaje de prueba</h1>
            </div>
        `,
        attachments: [{
            filename: 'Regalo.PNG',
            path: path.dirname(__dirname)+'/images/auto.PNG',
            cid: 'test_image',
        }]
    })
}
