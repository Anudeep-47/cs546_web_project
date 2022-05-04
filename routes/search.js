const express = require("express");
const router = express.Router();

const { searchDocs } = require("../models/doctors");

router.get("/:specialty/:insurance", async (req, res) => {
  let specialty = req.params.specialty;
  let insurance = req.params.insurance;

  try {
    const searchdocs = await searchDocs(specialty, insurance);
    res.render("pages/search", {
      title: "Search",
      searchScript: true,
      docs: searchdocs,
      docsEncoded: encodeURIComponent(JSON.stringify(searchdocs)),
      helpers: {
        counter: (n)=>n+1
      }
    });
  } catch (e) {
    res
      .status(404)
      .render("pages/error404", { error: e + "", title: "Error 404" });
  }
});
module.exports = router;
