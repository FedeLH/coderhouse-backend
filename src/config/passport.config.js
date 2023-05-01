import passport from "passport";
import GitHubStrategy from 'passport-github2';
import { userManager } from "../daos/db/user.mongo.dao";
import { CLIENT_ID, CLIENT_PASS, CB_URL } from './config/config.js'

const initializePassport = () => {
    // passport.serializeUser((user, done) => {
    //     done(null, user._id);
    // });

    // passport.deserializeUser(async (id, done) => {
    //     let user = await userManager.findById(id);
    //     done(null, user);
    // });
    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_PASS,
        callbackURL: CB_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = userManager.getUserByEmail(emails[0])
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: emails[0],
                    gender: '',
                    password: ''
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
}

export default initializePassport;