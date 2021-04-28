const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 세션에 user의 id만 저장.
    // done()되는 순간, routes>auth.js내에 req.login() 콜백함수가 실행된다.
  });

  //   {id: 3, 'connect.sid': s%313294580935404950}
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user)) // req.user로 젒근이 가능해짐.
      .catch((err) => done(err));
  });

  local();
  kakao();
};
