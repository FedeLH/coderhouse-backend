import passport from "passport";
import GitHubStrategy from 'passport-github2';
import { userManager } from "../daos/db/user.mongo.dao.js";
import { CLIENT_ID, CLIENT_PASS, CB_URL } from '../config/config.js'

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_PASS,
        callbackURL: CB_URL,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userManager.getUserByEmail(profile.emails[0].value)
            if(!user.length) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: 'Unknow',
                    email: profile.emails[0].value,
                    gender: 'Unknow',
                    password: 'Unknow'
                }
                let result = await userManager.addUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser(async (user, done) => {
        done(null, user);
    });
}

export default initializePassport;