const logout = (req, res) => {
    res.clearCookie("AuthCookie");
    req.session.destroy();
};

const authorizeDoctor = (req, doc_id) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.session.doctor = doc_id;
};

const authorizeUser = (req, user_id) => {
    if (req.session.doctor) {
        delete req.session.doctor;
    }
    req.session.user = user_id;
};



module.exports = {
    logout,
    authorizeUser,
    authorizeDoctor
}