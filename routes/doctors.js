const router = require("express").Router();

const {
  isNameInvalid,
  isEmailInvalid,
  isPasswordInvalid,
  isSpecialtyInvalid,
  isAddressInvalid,
} = require("../helpers/auth_helper");

const {
  createDoc,
  checkDoc,
  isDuplicateEmail,
  getDoctor,
  updateDoctor,
} = require("../models/doctors");

const { authorizeDoctor } = require("../controllers/auth");

router.get("/home", async (req, res) => {
  if (!req.session.doctor) {
    res.redirect("/doctor/login");
  } else {
    // get data for rendering here
    res.render("pages/doctor_home", {
      script_file: "doc_home",
      title: "Doctor Home",
    });
  }
});

router.get("/data", async (req, res) => {
  if (!req.session.doctor) {
    res.redirect("/doctor/login");
  } else {
    const id = req.session.doctor.id;
    const data = await getDoctor(id);
    res.json({
      schedules: data.schedules,
    });
  }
});

router.post("/data", async (req, res) => {
  if (!req.session.doctor) {
    res.redirect("/doctor/login");
  } else {
    const schedules = req.body.schedules;
    const id = req.session.doctor.id;
    schedules.forEach((schdl) => {
      schdl.available = JSON.parse(schdl.available);
      schdl.sessionTime = JSON.parse(schdl.sessionTime);
      if (!schdl.breakTimes) schdl.breakTimes = [];
    });
    const result = await updateDoctor(id, {
      schedules,
    });
    res.json({
      schedules: result.schedules,
    });
  }
});

router.get("/login", async (req, res) => {
  if (req.session.doctor) {
    res.redirect("/");
  } else {
    res.render("pages/login", {
      title: "Login",
      action: "/doctor/login",
      linkTo: "/doctor/signup",
    });
  }
});

router.get("/signup", async (req, res) => {
  if (req.session.doctor) {
    res.redirect("/");
  } else {
    res.render("pages/signup", {
      script_file: "auth_validation",
      title: "Sign Up",
      action: "/doctor/signup",
      linkTo: "/doctor/login",
      specialty: [
        "Acupuncturist",
        "Addiction Specialist",
        "Adult Nurse Practitioner",
      ],
    });
  }
});

router.post("/login", async (req, res) => {
  let email = req.body.email.trim();
  let password = req.body.password.trim();

  try {
    const doc = await checkDoc(email, password);
    if (doc) {
      authorizeDoctor(req, {
        id: doc._id,
        firstname: doc.firstname,
      });
      res.redirect("/doctor/home");
    } else {
      res.status(500).render("pages/error", {
        error: "Internal Server Error",
      });
    }
  } catch (error) {
    res.render("pages/login", {
      title: "Login",
      action: "/doctor/login",
      linkTo: "/doctor/signup",
      error,
    });
  }
});

router.post("/signup", async (req, res) => {
  let firstname = req.body.firstname.trim();
  let lastname = req.body.lastname.trim();
  let email = req.body.email.trim();
  let password = req.body.password.trim();
  let specialty = req.body.specialty.trim();
  let address = req.body.address.trim();
  let apartment = req.body.address2.trim();
  let city = req.body.address3.trim();
  let state = req.body.address4.trim();
  let zip = req.body.address5.trim();
  let country = req.body.address6.trim();

  const firstnameError = isNameInvalid(firstname);
  const lastnameError = isNameInvalid(lastname);
  let emailError = isEmailInvalid(email);
  const passwordError = isPasswordInvalid(password);
  const specialtyError = isSpecialtyInvalid(specialty);
  var addressError = isAddressInvalid(city);

  try {
    email = email.trim().toLowerCase();
    if (await isDuplicateEmail(email)) {
      emailError = "Account already present. Please Login";
    }
    if (
      firstnameError ||
      lastnameError ||
      emailError ||
      passwordError ||
      specialtyError ||
      addressError
    )
      throw "Validation error in doc signup!!";
    const { docInserted } = await createDoc(
      firstname,
      lastname,
      email,
      password,
      specialty,
      address,
      apartment,
      city,
      state,
      zip,
      country
    );
    if (docInserted) {
      res.redirect("/doctor/login");
    } else {
      res.status(500).render("pages/error", {
        error: "Internal Server Error",
      });
    }
  } catch (e) {
    console.log(e);
    res.render("pages/signup", {
      script_file: "auth_validation",
      title: "Sign Up",
      action: "/doctor/signup",
      linkTo: "/doctor/login",
      error: {
        firstnameError,
        lastnameError,
        emailError,
        passwordError,
        specialtyError,
        addressError,
      },
    });
  }
});

// router.get('/private', async (req, res) => {
//     try {
//         res.render('user/private', {
//             title: "Private",
//             username: req.session.user
//         })
//     } catch (error) {
//         res.status(400);
//     }
// });

module.exports = router;
