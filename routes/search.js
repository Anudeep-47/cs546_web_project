const express = require("express");
const router = express.Router();

const { searchD } = require("../models/doctors");

router.get("/:json", async (req, res) => {
  let searchJson = JSON.parse(req.params.json);
  let specialtyIn = searchJson.sspecialty;
  let insuranceIn = searchJson.iinsurance;
  let locationIn = searchJson.llocation_coords;
  var query;

  if (!specialtyIn) {
    specialtyIn = "Specialty";
  }
  if (!insuranceIn) {
    insuranceIn = "Choose your Insurance";
  }
  if (locationIn == false) {
    locationIn = [ -74.0059728, 40.7127753];
  } else{
    locationIn = [searchJson.llocation_coords.lng, searchJson.llocation_coords.lat];
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
    });
  } catch (e) {
    res
      .status(404)
      .render("pages/error404", { error: e + " ", title: "Error 404" });
  }
});
module.exports = router;
