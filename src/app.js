import express from "express";
import { router } from "./routes/index.js";
import __dirname from "./utils/utils.js";
import path from "path";
import handlerbars from "express-handlebars";
import { firstItem } from "./config/helper.js";
import objConfig from "./config/db.js";
import session from "express-session";
import FileStore from "session-file-store";
import pkg from "connect-mongo";

const { create } = pkg;

const fileStorege = FileStore(session);
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
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static(path.dirname(__dirname) + "/public"));

app.use(router);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal error");
});

export default app;
