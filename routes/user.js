const express = require("express");
const { User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// POST /user/1/follow
router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 내가 누군지(나에 대한 정보)를 찾고
    if (user) {
      await user.addFollowings([parseInt(req.params.id, 10)]); // setFollowings, removeFollowings getFollowings 등등
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
