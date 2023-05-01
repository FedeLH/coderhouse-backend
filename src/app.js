import express from "express";
import { router } from "./routes/index.js";
import __dirname from "./utils/utils.js";
import path from "path";
import handlerbars from "express-handlebars";
import { firstItem } from "./config/helper.js";
import objConfig from "./config/db.js";
import session from "express-session";
import pkg from "connect-mongo";
import authSession from "./middlewares/auth.middleware.js";
import { SESSION_SECRET } from "./config/config.js";
import initializePassport from "./config/passport.config.js";

const { create } = pkg;

objConfig.connectDB();
const app = express();

app.engine(
  "handlebars",
  handlerbars.engine({ helpers: { firstItem: firstItem } })
);
app.set("view engine", "handlebars");
app.set("views", path.dirname(__dirname) + "/views");

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

app.use(express.static(path.dirname(__dirname) + "/public"));

app.use(authSession, router);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal error");
});

export default app;
