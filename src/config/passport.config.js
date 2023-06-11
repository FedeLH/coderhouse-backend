import passport from "passport";
import local from "passport-local";
import { createHash, checkValidPassword } from "../utils/utils.js";
import GitHubStrategy from "passport-github2";
import { userDao, cartDao } from "../daos/factory.js";
import { CLIENT_ID, CLIENT_PASS, CB_URL } from "../config/config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          let user = await userDao.getUserByEmail(username);
          if (user.length) {
            console.log("User already exists");
            return done(null, false);
          }
          const { first_name, last_name, gender } = req.body;
          let cart = await cartDao.addCart();
          let newUser = {
            first_name,
            last_name,
            email: username,
            gender,
            password: createHash(password),
            cart,
          };
          let result = await userDao.addUser(newUser);
          done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userDao.getUserByEmail(username);
          if (!user.length) {
            console.log("User doesn't exist");
            return done(null, false);
          }

          const isValidPassword = checkValidPassword({
            hashedPassword: user[0].password,
            password,
          });

          if (!isValidPassword) return done(null, false);

          done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
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
          let user = await userDao.getUserByEmail(profile.emails[0].value);
          if (!user.length) {
            let cart = await cartDao.addCart();
            let newUser = {
              first_name: profile._json.name ?? "Unknow",
              last_name: "Unknow",
              email: profile.emails[0].value,
              gender: "Unknow",
              password: "Unknow",
              cart,
            };
            let result = await userDao.addUser(newUser);
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
