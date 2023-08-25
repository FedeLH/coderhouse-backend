import express from "express";
import { sendMailTransport } from "../utils/nodemailer.js";
import { userDao, tokenDao } from "../daos/factory.js";
import { createHash, checkValidPassword } from "../utils/utils.js";

const router = express.Router();

router.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body
        const arrayUser = await userDao.getUserByEmail(email)
        if (!arrayUser.length > 0) throw new Error("This email is invalid")
        const { _id, first_name, last_name } = arrayUser[0]
        const tokens = await tokenDao.getByUserId(_id)
        if (!tokens.length > 0) {
            const generateId = () => Math.random().toString(36).substring(2, 18);
            const compA = generateId()
            const compB = generateId()
            const generatedToken = compA+compB
            let expiration_date = new Date();
            expiration_date.setHours(expiration_date.getHours()+1);
            const newToken = {
                token: generatedToken,
                expiration_date,
                user: _id
            }
            await tokenDao.create(newToken)
            //TODO: reemplazar localhost por el dominio de nuestra pagina
            const url = `http://localhost:8080/reset-password/${_id}?token=${generatedToken}`
            const configMail = {
                to: email,
                subject: "Restablecer contraseña",
                html: `
                    <h1>${first_name} ${last_name}</h1>
                    <p>Recibimos una solicitud de restablecimiento de contraseña, en caso de que no fuera usted, simplemente ignore este correo electrónico, en caso de que desee restablecer su contraseña, simplemente siga el siguiente enlace.</p>
                    <a href="${url}">Restablecer contraseña</a>
                `
            }
            await sendMailTransport(configMail)
        }
        res.render("success", {
            title: "Success",
            style: "success.css",
            header: "Email enviado correctamente",
            message: "Por favor revise su casilla de correos, debería recibir un enlace para restablecer su contraseña en breve, no olvide revisar la sección de spam."
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            style: "error.css",
            error: error,
            message: error.message,
            path: [{ url: "/forgot-password", text: "Volver"}]
          });
    }
})

router.post("/reset", async (req, res) => {
    try {
        const { password, repeatPassword, uid, token } = req.body
        const objToken = await tokenDao.getByToken(token)
        if (!objToken) throw new Error("Este token es inválido")
        const strToken = objToken.user.toString()
        if (uid !== strToken) throw new Error("Este id de usuario es inválido")
        if (password !== repeatPassword) throw new Error("Ambas contraseñas no coinciden")
        const arrayUser = await userDao.getUserById(uid)
        const oldPassword = arrayUser[0].password
        const isEqualOldPassword = checkValidPassword({
            hashedPassword: oldPassword,
            password,
        });
        if (isEqualOldPassword) throw new Error("Su nueva contraseña no puede ser igual a la contraseña actual")
        await tokenDao.delete(objToken._id)
        const now = new Date()
        if (now > objToken.expiration_date) throw new Error("Este token expiró")
        const newPassword = createHash(password)
        const update = {
            password: newPassword
        }
        await userDao.updateUser(uid,update)
        res.json({
            status: "success",
            payload: "La contraseña fue actualizada correctamente"
        })
    } catch (error) {
        res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
        });
    }
})

export default router;