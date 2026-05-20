/// imports
/// ===============
const morgan = require("morgan");
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();
const adminRoutes = require("./routes/admin routes/adminRoutes");
const authRoutes = require("./routes/admin routes/authRoutes");
const multer = require("multer");
const session = require("express-session");
const { default: MongoStore } = require("connect-mongo");
const dirname = require("./utils/pathUtils");
const path = require("path");
const { envVariables } = require("./utils/envVariables");
const userAuthRoutes = require("./routes/user routes/userAuthRoutes");
const userRoutes = require("./routes/user routes/userRoutes");
const productRoutes = require("./routes/user routes/productRoutes");
const categoryRoutes = require("./routes/user routes/categoryRoutes");
const productReviewRoutes = require("./routes/user routes/productReviewRoutes");
const orderRoutes = require("./routes/user routes/orderRoutes");
const addressRoutes = require("./routes/user routes/addressRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const errorHandler = require("./middleware/errorHandler");
/// ===============

/// app use & set
/// ===============
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "views");
app.use("/productImages", express.static(path.join(dirname, "productImages")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(morgan("dev"));
/// ===============

/// session & cookie
/// ===============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "productImages/");
  },
  filename: (req, file, cb) => {
    const uniqueName = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", "-")
      .replace(/:/g, "-");
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName + "-" + cleanName);
  },
});

app.use(
  session({
    secret: envVariables.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: envVariables.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,
    },
  }),
);
app.use(multer({ storage }).single("productImage"));
/// ===============

/// admin MVC routes
/// ===============
app.get("/index", (req, res) => {
  res.render("index");
});
app.use("/auth", authRoutes);
app.use("/admin", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/auth/login");
  }
  next();
});
app.use("/admin", adminRoutes);
/// ===============

/// REST APIs routes
/// ===============
app.use("/user-auth", userAuthRoutes);
app.use("/app-users", userRoutes);
app.use("/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/product-review", productReviewRoutes);
app.use("/order", orderRoutes);
app.use("/address", addressRoutes);
/// ===============

/// Global Error Handler
/// ===============
app.use(errorHandler);
/// ===============

/// mongo and server
/// ===============
mongoose
  .connect(envVariables.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(envVariables.PORT, "0.0.0.0", () => {
      console.log("server has started:- http://localhost:3000/index");
    });
  })
  .catch((err) => console.log(err));
/// ===============
