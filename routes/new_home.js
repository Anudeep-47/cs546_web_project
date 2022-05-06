const router = require("express").Router();

const {
    getTopDoctors
} = require('../models/doctors');

const {
    prepHomeDocs
} = require('../helpers/doc_helper');


router.get('/', async (req, res) => {
    const topRatedDoctors = await getTopDoctors({
        count: 6
    });
    const topPrimaryDoctors = await getTopDoctors({
        specialty: "Primary Care",
        count: 6
    });
    const topDentists = await getTopDoctors({
        specialty: "Dentist",
        count: 6
    });
    const top_rated = prepHomeDocs(topRatedDoctors);
    const top_primary = prepHomeDocs(topPrimaryDoctors);
    const top_dentist = prepHomeDocs(topDentists);
    res.render("pages/new_home", {
        title: 'Home',
        top_rated1: top_rated.slice(0, 3),
        top_rated2: top_rated.slice(3, 6),
        top_primary1: top_primary.slice(0, 3),
        top_primary2: top_primary.slice(3, 6),
        top_dentist1: top_dentist.slice(0, 3),
        top_dentist2: top_dentist.slice(3, 6)
    });
});


module.exports = router;