import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userManager } from "../daos/db/user.mongo.dao.js";
import { CLIENT_ID, CLIENT_PASS, CB_URL } from "../config/config.js";
import { createHash, checkValidPassword } from "../utils/utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          let newUser = req.body;
          newUser.password = createHash(newUser.password);
          let user = await userManager.getUserByEmail(newUser.email);
          if (user.length) {
            console.log("User already exists");
            return done(null, false);
          }
          const result = await userManager.addUser(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await userManager.getUserByEmail(username);

        if (!user.length) {
          console.log("User doesn't exist");
          return done(null, false);
        }
        const isValidPassword = checkValidPassword({
          hashedPassword: user[0].password,
          password,
        });

        if (!isValidPassword) return done(null, false);
        return done(null, user[0]);
      } catch (error) {}
    })
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_PASS,
        callbackURL: CB_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.getUserByEmail(profile.emails[0].value);
          if (!user.length) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "Unknow",
              email: profile.emails[0].value,
              gender: "Unknow",
              password: "Unknow",
            };
            let result = await userManager.addUser(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    done(null, user);
  });
};

export default initializePassport;
