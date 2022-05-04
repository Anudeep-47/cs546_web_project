const router = require("express").Router();


router.get('/', async (req, res) => {
        res.render('pages/home', {
            title: "Home"
        });
    });

    router.post("/", async (req, res) => {
        let specialty = req.body.specialty;
        let insurance = req.body.insurance;
        let errors = [];
      
        if (!specialty) {
          specialty = "Specialty";
        }
        if (!insurance) {
          insurance = "Choose your Insurance";
          }
      
        if (errors.length == 0) {
          if (insurance.trim().length == 0 || specialty.trim().length == 0) {
            errors.push("Can't Search Only spaces");
          }
        }
      
        if (errors.length > 0) {
          res.status(400).render("pages/error400", {
            errors: errors,
            hasErrors: true,
            title: "Error 400",
          });
          return;
        }
      
        try {
          res.redirect(`/search/${specialty}/${insurance}`);
        } catch (e) {
          res.status(500).json({ error: e });
        }
      
        return;
      });

    module.exports = router;