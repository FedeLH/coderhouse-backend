import express from "express";
import { router } from "./routes/index.js";
import __dirname from "./utils/utils.js";
import handlerbars from "express-handlebars";
import { firstItem } from "./config/helper.js";
import objConfig from "./config/db.js";
import session from "express-session";
import pkg from "connect-mongo";
import { SESSION_SECRET } from "./config/config.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import addLogger from "./utils/logger.js";

const { create } = pkg;

const app = express();

app.engine(
  "handlebars",
  handlerbars.engine({ helpers: { firstItem: firstItem } })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();

app.use(
  session({
    store: create({
      mongoUrl: objConfig.url,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100000000 * 24,
    }),
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger)

app.use(express.static(__dirname + "/public"));

app.use(router);

app.use((err, req, res, next) => {
  req.logger.error(err);
  res.status(500).send("Internal error");
});


export default app;
