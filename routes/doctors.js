const router = require("express").Router();

const {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isSpecialtyInvalid
} = require('../helpers/auth_helper');

const {
    createDoc,
    checkDoc,
    isDuplicateEmail
} = require('../models/doctors');

const {
    logout,
    authorizeDoctor
} = require('../controllers/auth');


router.get('/login', async (req, res) => {
    if (req.session.doctor) {
        res.redirect('/');
    } else {
        res.render('pages/login', {
            title: "Login",
            action: "/doctor/login",
            linkTo: "/doctor/signup"
        });
    }
});


router.get('/signup', async (req, res) => {
    if (req.session.doctor) {
        res.redirect('/');
    } else {
        res.render('pages/signup', {
            title: "Sign Up",
            action: "/doctor/signup",
            linkTo: "/doctor/login",
            specialty: ['Acupuncturist', 'Addiction Specialist', 'Adult Nurse Practitioner']
        });
    }
});


router.post('/login', async (req, res) => {
    let email = req.body.email.trim();
    let password = req.body.password.trim();

    try {
        const doc = await checkDoc(email, password);
        if (doc) {
            authorizeDoctor(req, doc._id);
            res.redirect('/');
        } else {
            res.status(500).render("pages/error", {
                error: "Internal Server Error"
            });
        }
    } catch (error) {
        res.render('pages/login', {
            title: "Login",
            action: "/doctor/login",
            linkTo: "/doctor/signup",
            error
        });
    }
});


router.post('/signup', async (req, res) => {
    let firstname = req.body.firstname.trim();
    let lastname = req.body.lastname.trim();
    let email = req.body.email.trim();
    let password = req.body.password.trim();
    let specialty = req.body.specialty.trim();

    const firstnameError = isNameInvalid(firstname);
    const lastnameError = isNameInvalid(lastname);
    let emailError = isEmailInvalid(email);
    const passwordError = isPasswordInvalid(password);
    const specialtyError = isSpecialtyInvalid(specialty);

    try {
        email = email.trim().toLowerCase();
        if (await isDuplicateEmail(email)) {
            emailError = "Account already present. Please Login";
        }
        if(firstnameError || lastnameError || emailError || passwordError || specialtyError) throw 'Validation error in doc signup!!';
        const {
            docInserted
        } = await createDoc(firstname, lastname, email, password, specialty);
        if (docInserted) {
            res.redirect("/doctor/login");
        } else {
            res.status(500).render("pages/error", {
                error: "Internal Server Error"
            });
        }
    } catch (e) {
        console.log(e);
        res.render('pages/signup', {
            title: "Sign Up",
            action: "/doctor/signup",
            linkTo: "/doctor/login",
            error: {
                firstnameError,
                lastnameError,
                emailError,
                passwordError,
                specialtyError
            }
        });
    }
});


router.get('/logout', function (req, res) {
    logout(req, res);
    res.redirect('/');
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