const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const { searchD } = require("../models/doctors");

/* router.get("/", async (req, res) => {
  res.render("pages/search", {
    title: "Search",
  })
}) */



router.get("/", async (req, res) => {
  let searchJson = req.query;
  if(JSON.stringify(searchJson) !== '{}'){
  let specialtyIn = searchJson.Specialty;
  let insuranceIn = searchJson.Insurance;
  let locationError;
  let locationIn = await getloc(searchJson.Location);
  var query;

  if (!specialtyIn) {
    specialtyIn = "Specialty";
  }
  if (!insuranceIn) {
    insuranceIn = "Choose your Insurance";
  }
  if (locationIn == false) {
    locationIn = [ -74.0059728, 40.7127753];
    locationError = "Please enter search location again, Meanwhile showing doctor's near NYC";
  } else{
    locationIn = [locationIn.lng, locationIn.lat];
  }

  if (
    specialtyIn == "Specialty" &&
    (insuranceIn == "Choose your Insurance" || insuranceIn == "self")
  ) {
    query = {};
  } else if (
    insuranceIn !== "Choose your Insurance" &&
    insuranceIn !== "self" &&
    specialtyIn == "Specialty"
  ) {
    query = { insurance: insuranceIn };
  } else if (
    specialtyIn !== "Specialty" &&
    (insuranceIn == "Choose your Insurance" || insuranceIn == "self")
  ) {
    query = { specialty: specialtyIn };
  } else {
    query = { specialty: specialtyIn.toString(), insurance: insuranceIn.toString() };
  }

  try {
    const searchdocs = await searchD(query, locationIn);
    res.render("pages/search", {
      title: "Search",
      searchScript: true,
      docs: searchdocs,
      docsEncoded: encodeURIComponent(JSON.stringify(searchdocs)),
      helpers: {
        counter: (n) => n + 1,
      },
      locError : locationError,
    });
  } catch (e) {
    res
      .status(404)
      .render("pages/error404", { error: e + " ", title: "Error 404" });
  }
} else{
  res.render("pages/search", {
    title: "Search",
  })
}


});


async function getloc(fadd) {
  if(fadd == ''){
    return false
  }
  var { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${fadd}&key=AIzaSyBFYx4flUaipnwrahPBPcFqVLqkKyLwVnE`
  );
  if (data.results[0]) {
    data = data.results[0].geometry.location;
    return data;
  } else {
    data = false;
  }

  return data;
}

router.post("/", async (req, res) => {
  let specialty = req.body.specialty;
  let insurance = req.body.insurance;
  let location = req.body.locationS;
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
  let sendSearch = {
    Specialty: specialty,
    Insurance: insurance,
    Location: location,
  };

  sendSearch = new URLSearchParams(sendSearch)

  try {
    res.redirect(`/search/?${sendSearch}`);
  } catch (e) {
    res.status(500).json({ error: e });
  }

  return;
});
module.exports = router;
