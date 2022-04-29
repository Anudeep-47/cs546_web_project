const userRoutes = require('./users');
const doctorRoutes = require('./doctors');

const {
    getAuthDetails
} = require('../helpers/auth_helper');

const {
    logout,
    setAuthInfo
} = require('../controllers/auth');

const constructor = (app) => {
    app.use((req, res, next) => {
        setAuthInfo(req, res);
        console.log(`[${new Date().toUTCString()}]: ${req.method}  ${req.originalUrl}  (${getAuthDetails(req.session)})`);
        next();
    });

    app.use('/logout', async (req, res) => {
        logout(req, res);
        res.redirect('/');
    });
    
    app.use('/search', async (req, res) => {
        res.render('pages/search', {
            title: "Search",
            
        });
    });
    
    app.use('/user', userRoutes);
    app.use('/doctor', doctorRoutes);

    app.use('/', async (req, res) => {
        res.render('pages/home', {
            title: "Home",

        });
    });

    // app.use('/', async (req, res, next) => {
    //     if (!!req.session.user) {
    //         next();
    //     } else {
    //         res.redirect('/user/login');
    //         // res.status(403).render('user/error', {
    //         //     title: "Error",
    //         //     error: "ERROR 403: User not Logged In!!"
    //         // });
    //     }
    // });

    app.use('*', (req, res) => {
        res.status(404).render("user/error", {
            title: "Error",
            error: "No Page Found"
        });
    });
};


module.exports = constructor;