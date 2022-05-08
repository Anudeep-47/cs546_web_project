const bcrypt = require('bcrypt');

const {
    getUsers,
    getApps,
    MongoError
} = require('../config/mongoCollections');

const {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isNumberInvalid
} = require('../helpers/auth_helper');


const isDuplicateEmail = async (email) => {
    const users = await getUsers();
    let user = await users.findOne({
        email
    });
    if (user) return true;
    return false;
};

const createUser = async (firstname, lastname, email, password) => {
    const firstnameError = isNameInvalid(firstname);
    const lastnameError = isNameInvalid(lastname);
    const emailError = isEmailInvalid(email);
    const passwordError = isPasswordInvalid(password);
    try {
        if(firstnameError || lastnameError || emailError || passwordError) throw 'Validation error in createUser!!';
        const saltRounds = 16;
        password = await bcrypt.hash(password, saltRounds);
        const users = await getUsers();
        const {
            acknowledged,
            insertedId
        } = await users.insertOne({
            firstname,
            lastname,
            email,
            password
        });
        return {
            userInserted: acknowledged && insertedId
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const checkUser = async (email, password) => {
    try {
        email = email.trim().toLowerCase();
        const users = await getUsers();
        let user = await users.findOne({
            email
        });
        if (!user) throw "Either the email or password is invalid";
        const result = await bcrypt.compare(password, user.password);
        if (!result) throw "Either the email or password is invalid";
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = {
    createUser,
    checkUser,
    isDuplicateEmail
}
