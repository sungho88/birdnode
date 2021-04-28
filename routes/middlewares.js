// 내가 로그인을 한 상태인가?
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // 로그인 된 상태
  } else {
    res.status(403).send("로그인 필요");
  }
};

// 내가 로그인 안 했나?
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); // 로그인 안 된 상태
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
