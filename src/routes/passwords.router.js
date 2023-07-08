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
                subject: "Reset password",
                html: `
                    <h1>${first_name} ${last_name}</h1>
                    <p>We received a password reset request, in case that wasn't you, just ignore this email, in case you want to reset your password just follow the following link.</p>
                    <a href="${url}">Reset password</a>
                `
            }
            await sendMailTransport(configMail)
        }
        res.render("success", {
            title: "Success",
            style: "success.css",
            header: "Email sent successfully",
            message: "Please check your email, you should receive a link to reset your password shortly, don't forget to check the spam section."
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            style: "error.css",
            error: error,
            message: error.message,
            path: [{ url: "/forgot-password", text: "Back"}]
          });
    }
})

router.post("/reset", async (req, res) => {
    try {
        const { password, repeatPassword, uid, token } = req.body
        const objToken = await tokenDao.getByToken(token)
        if (!objToken) throw new Error("This token is invalid")
        const strToken = objToken.user.toString()
        if (uid !== strToken) throw new Error("This user id is invalid")
        if (password !== repeatPassword) throw new Error("Both passwords not match")
        const arrayUser = await userDao.getUserById(uid)
        const oldPassword = arrayUser[0].password
        const isEqualOldPassword = checkValidPassword({
            hashedPassword: oldPassword,
            password,
        });
        if (isEqualOldPassword) throw new Error("Your new password cannot be the same as the current password")
        await tokenDao.delete(objToken._id)
        const now = new Date()
        if (now > objToken.expiration_date) throw new Error("This token is expirated")
        const newPassword = createHash(password)
        const update = {
            password: newPassword
        }
        await userDao.updateUser(uid,update)
        res.json({
            status: "success",
            payload: "The password was successfully updated"
        })
    } catch (error) {
        res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
        });
    }
})

export default router;