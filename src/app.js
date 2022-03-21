import path from "path";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { create } from "express-handlebars";
import productsRoutes from "./routes/products.routes";
import printersRoutes from "./routes/printers.routes";
import { deleteFileLogOut } from "./utils/writeFiles";

import config from "./config";

const app = express();

// settings
app.set("port", config.port);
app.set ("views", path.join(__dirname , "views"));

app.engine(
    ".hbs", 
    create({
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        defaulLayout: "main",
        extname: ".hbs",        
      }).engine
    );
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: 'S3CRE7', resave: true, saveUninitialized: true}));

// Routes
app.use(productsRoutes);
app.use(printersRoutes);
app.use("/logout", (req,res)=>{
    deleteFileLogOut(req.sessionID);
    req.session.destroy();
    res.render("logout")
  }
);

// public route
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.status(404).render("404");
});

export default app;
