

const isNameInvalid = (name) => {
    if (name === undefined || name.trim().length === 0 || !/^[a-z\s]+$/i.test(name.trim())) {
        return 'Name should only have letters and not be empty';
    }
    return false;
};

const isEmailInvalid = (email) => {
    // regex -> /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // unicode regex -> /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (email === undefined || 
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim())) {
        return 'Email is invalid';
    }
    return false
};

const isPasswordInvalid = (password) => {
    if (password === undefined || typeof (password) !== 'string' || password.trim().length < 6 || !/^\S+$/.test(password)) {
        return 'Password should be atleast 6 characters (no spaces)';
    }
    return false;
};

const isSpecialtyInvalid = (specialty) => {
    if (specialty === undefined || specialty === 'Specialty') {
        return 'Please choose a specialty';
    }
    return false;
};

const getAuthDetails = (req_session) => {
    // console.log(req_session);
    if(req_session.user){
        return `Authenticated User '${req_session.user.id}'`;
    }
    if(req_session.doctor){
        return `Authenticated Doctor '${req_session.doctor.id}'`;
    }
    return "Non-Authenticated";
};


module.exports = {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isSpecialtyInvalid,
    getAuthDetails
}