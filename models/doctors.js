const bcrypt = require('bcrypt');

const {
    getDocs,
    MongoError
} = require('../config/mongoCollections');

const {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isSpecialtyInvalid
} = require('../helpers/auth_helper');


const isDuplicateEmail = async (email) => {
    const docs = await getDocs();
    let doc = await docs.findOne({
        email
    });
    if (doc) return true;
    return false;
};

const createDoc = async (firstname, lastname, email, password, specialty) => {
    const firstnameError = isNameInvalid(firstname);
    const lastnameError = isNameInvalid(lastname);
    const emailError = isEmailInvalid(email);
    const passwordError = isPasswordInvalid(password);
    const specialtyError = isSpecialtyInvalid(specialty);
    try {
        if(firstnameError || lastnameError || emailError || passwordError || specialtyError) throw 'Validation error in createDoc!!';
        const saltRounds = 16;
        password = await bcrypt.hash(password, saltRounds);
        const docs = await getDocs();
        const {
            acknowledged,
            insertedId
        } = await docs.insertOne({
            firstname,
            lastname,
            email,
            password,
            specialty
        });
        return {
            docInserted: acknowledged && insertedId
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const checkDoc = async (email, password) => {
    try {
        email = email.trim().toLowerCase();
        const docs = await getDocs();
        let doc = await docs.findOne({
            email
        });
        if (!doc) throw "Either the email or password is invalid";
        const result = await bcrypt.compare(password, doc.password);
        if (!result) throw "Either the email or password is invalid";
        return doc;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



module.exports = {
    createDoc,
    checkDoc,
    isDuplicateEmail
}