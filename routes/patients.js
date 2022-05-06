const router = require("express").Router();


router.get('/:id', async (req, res) => {
    if (!req.session.doctor) {
        res.redirect("/doctor/login");
      } else {
        // get data for rendering here
        res.render("pages/patient", {
          script_file: "patient",
          title: "Patient",
        });
      }
});


module.exports = router;