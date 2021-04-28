const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");
const { route } = require("./page");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 회원가입(Join) Router
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } }); // 이메일이 있는가?
    if (exUser) {
      return res.redirect("/join?error=exist"); // 있다면, 있다고 에러 메세지. 돌려보냄.
    }
    const hash = await bcrypt.hash(password, 12); // bcrypt로 해시화.
    await User.create({
      // 회원가입시킴.
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인 Router
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    // localStrategy.js에서 done()함수를 받아온다.
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // user = false일경우 실행됨.
      return res.redirect(`/?loginError=${info.message}`);
    }

    // req.login 하는 순간, passport>index.js의 serializeUser()로 이동
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 세션 쿠키를 브라우저로 보내줘요. 그다음 요청부터는 누가 보냈는지 알수 있게 된다. 즉, 로그인 된 상태로 유지됨.
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내 미들웨어를 사용할때는 끝에 (req,res,next); 를 붙인다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);
module.exports = router;
