const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");
const helmet = require("helmet");
const hpp = require("hpp");

dotenv.config();

const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

const { sequelize } = require("./models");
const passportConfig = require("./passport");
const app = express();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
app.enable("trust proxy");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false }) // force:true를 하면, 테이블이 지워졌다가 다시 생성됨.
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
};

if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
}

app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session()); // express session보다 아래 위치해야함.
// 이것들이 실행되면, passport > index.js에 passport.deserializeUser()가 실행됨.

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

// 404 처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
