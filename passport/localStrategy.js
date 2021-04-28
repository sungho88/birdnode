const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email 반드시 일치시켜야함.
        passwordField: "password", // req.body.password 반드시 일치시켜야함.
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser); // 1번째: 서버 에러, 2번째: 로그인 성공, 3번째: 로그인이 실패했을 때 에러메세지.
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다..." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다..." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
