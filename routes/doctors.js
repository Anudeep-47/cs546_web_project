const router = require("express").Router();
const axios = require("axios").default;


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

const {
  authorizeDoctor
} = require("../controllers/auth");
const {
  getDocReviews
} = require("../models/reviews");
const {
  prepDocPageData
} = require("../helpers/doc_helper");



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

router.get('/data/:doc_id?', async (req, res) => {
  if (!req.params.doc_id && !req.session.doctor) {
    res.redirect('/doctor/login');
  } else {
    const id = req.params.doc_id || req.session.doctor.id;
    const data = await getDoctor(id);
    res.json({
      schedules: data.schedules
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
      address_script: "true",
      title: "Sign Up",
      action: "/doctor/signup",
      linkTo: "/doctor/login",
      specialty: [
        "Acupuncturist",
        "Addiction Specialist",
        "Adult Nurse Practitioner",
        "Dentist",
        "Dermatologist",
        "Primary Care",
        "Eye Doctor",
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
  const fullAddress = address + " " + city + " " + " " + state + " " + zip;
  let geoloc;

  async function getloc(fadd) {
    var {
      data
    } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${fadd}&key=AIzaSyBFYx4flUaipnwrahPBPcFqVLqkKyLwVnE`
    );
    if (data.results[0]) {
      data = data.results[0].geometry.location;
      return data;
    } else {
      data = {
        lat: 0,
        lng: 0
      }
      addressError = "Please enter address again, GPS coordinates not found"
    }

    return data
  }

  geoloc = await getloc(fullAddress);

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
    const {
      docInserted
    } = await createDoc(
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
      country,
      geoloc
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
      address_script: "true",
      title: "Sign Up",
      action: "/doctor/signup",
      linkTo: "/doctor/login",
      specialty: [
        "Acupuncturist",
        "Addiction Specialist",
        "Adult Nurse Practitioner",
        "Dentist",
        "Dermatologist",
        "Primary Care",
        "Eye Doctor",
      ],
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



router.post('/appointment', async (req, res) => {
  const bookingDetails = req.body.bookingDetails;
  const {
    doc_id,
    insurance,
    reason,
    new_patient,
    timeSlot
  } = bookingDetails;
  if (!doc_id || !insurance || !reason || !new_patient || !timeSlot) {
    res.redirect('/');
  } else {
    req.session.apptmnt = bookingDetails;
    res.json({
      url: '/user/booking'
    });
  }
});


router.get("/:id", async (req, res) => {
  let id = req.params.id;
  if (!id || id.trim().length === 0) {
    res.render('/');
  }
  id = id.trim();
  const doc_data = await getDoctor(id);
  const doc_reviews = await getDocReviews(id);
  doc_data.reviews = doc_reviews;
  const page_data = prepDocPageData(doc_data);
  let location_coords = doc_data.coords
  res.render('pages/doctor', {
    title: "Doctor",
    script_file: "doc_public",
    mapsApi: true,
    location_c : encodeURIComponent(JSON.stringify(location_coords)),
    id,
    helpers: {
      star(num, rating) {
        return Math.round(rating) < num ? "" : "star";
      }
    },
    ...page_data
  });
});


module.exports = router;