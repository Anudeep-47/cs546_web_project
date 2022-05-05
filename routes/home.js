const axios = require("axios").default;

const router = require("express").Router();

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
    data = { lat: 74.006, lng: 40.7128 };
    locationError = "Please enter address again, GPS coordinates not found";
  }

  return data;
}

router.get("/", async (req, res) => {
  res.render("pages/home", {
    title: "Home",
  });
});

router.post("/", async (req, res) => {
  let specialty = req.body.specialty;
  let insurance = req.body.insurance;
  let location = req.body.locationS;
  let errors = [];
  var locationError = "";
  let location_coords = await getloc(location);

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
    sspecialty: specialty,
    iinsurance: insurance,
    llocation_coords: location_coords,
  };

  try {
    res.redirect(`/search/${JSON.stringify(sendSearch)}`);
  } catch (e) {
    res.status(500).json({ error: e });
  }

  return;
});

module.exports = router;
