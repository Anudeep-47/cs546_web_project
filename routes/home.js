

const router = require("express").Router();

router.get("/", async (req, res) => {
  res.render("pages/home", {
    title: "Home",
  });
});


module.exports = router;
