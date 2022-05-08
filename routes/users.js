const router = require("express").Router();

const {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isNumberInvalid,
    isSpecialtyInvalid
} = require('../helpers/auth_helper');

const {
    splitAppointments
} = require('../helpers/apptmnt_helper');

const {
    createUser,
    checkUser,
    isDuplicateEmail
} = require('../models/users');

const {
    logout,
    authorizeUser
} = require('../controllers/auth');

const {
    getUserAppointments
} = require('../models/appointments');



router.get('/home', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/user/login');
    } else {
        const userId = req.session.user._id;
        const apptmnts = await getUserAppointments(userId);
        const {
            newApptmnts,
            pastApptmnts
        } = splitAppointments(apptmnts);
        res.render('pages/user_home', {
            script_file: "user_home",
            title: "Patient Home",
            newApptmnts,
            pastApptmnts
        });
    }
});

router.get('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('pages/login', {
            title: "Login",
            action: "/user/login",
            linkTo: "/user/signup"
        });
    }
});


router.get('/signup', async (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('pages/signup', {
            script_file: "auth_validation",
            title: "Sign Up",
            action: "/user/signup",
            linkTo: "/user/login"
        });
    }
});


router.post('/login', async (req, res) => {
    let email = req.body.email.trim();
    let password = req.body.password.trim();

    try {
        const user = await checkUser(email, password);
        if (user) {
            authorizeUser(req, {
                id: user._id,
                firstname: user.firstname
            });
            res.redirect('/user/home');
        } else {
            res.status(500).render("pages/error", {
                error: "Internal Server Error"
            });
        }
    } catch (error) {
        res.render('pages/login', {
            title: "Login",
            action: "/user/login",
            linkTo: "/user/signup",
            error
        });
    }
});


router.post('/signup', async (req, res) => {
    let firstname = req.body.firstname.trim();
    let lastname = req.body.lastname.trim();
    let email = req.body.email.trim();
    let password = req.body.password.trim();

    const firstnameError = isNameInvalid(firstname);
    const lastnameError = isNameInvalid(lastname);
    let emailError = isEmailInvalid(email);
    const passwordError = isPasswordInvalid(password);

    try {
        email = email.trim().toLowerCase();
        if (await isDuplicateEmail(email)) {
            emailError = "Account already present. Please Login";
        }
        if (firstnameError || lastnameError || emailError || passwordError) throw 'Validation error in user signup!!';
        const {
            userInserted
        } = await createUser(firstname, lastname, email, password);
        if (userInserted) {
            res.redirect("/user/login");
        } else {
            res.status(500).render("pages/error", {
                error: "Internal Server Error"
            });
        }
    } catch (e) {
        console.log(e);
        res.render('pages/signup', {
            script_file: "auth_validation",
            title: "Sign Up",
            action: "/user/signup",
            linkTo: "/user/login",
            error: {
                firstnameError,
                lastnameError,
                emailError,
                passwordError
            }
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
