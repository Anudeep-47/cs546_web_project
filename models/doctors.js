const bcrypt = require("bcrypt");

const {
    getDocs,
    ObjectId,
    MongoError
} = require("../config/mongoCollections");

const {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isSpecialtyInvalid,
} = require("../helpers/auth_helper");

const getDoctor = async (id) => {
    const _id = ObjectId(id);
    const docs = await getDocs();
    let doc = await docs.findOne({
        _id,
    });
    if (!doc) throw `Cannot find doctor with id: ${id}`;
    doc._id = doc._id.toString();
    return doc;
};

const updateDoctor = async (id, data) => {
    const _id = ObjectId(id);
    const docs = await getDocs();
    let doc = await docs.findOne({
        _id,
    });
    if (!doc) throw `Cannot find doctor with id: ${id}`;
    const res = await docs.findOneAndUpdate({
        _id,
    }, {
        $set: data,
    }, {
        returnDocument: "after",
    });
    doc = res.value;
    if (doc === null) throw `Failed to update doctor with id: ${id}`;
    doc._id = doc._id.toString();
    return doc;
};

const isDuplicateEmail = async (email) => {
    const docs = await getDocs();
    let doc = await docs.findOne({
        email,
    });
    if (doc) return true;
    return false;
};

const createDoc = async (
    firstname,
    lastname,
    email,
    password,
    specialty,
    address,
    apartment,
    city,
    state,
    zip,
    country,
    coords
) => {
    const firstnameError = isNameInvalid(firstname);
    const lastnameError = isNameInvalid(lastname);
    const emailError = isEmailInvalid(email);
    const passwordError = isPasswordInvalid(password);
    const specialtyError = isSpecialtyInvalid(specialty);
    try {
        if (
            firstnameError ||
            lastnameError ||
            emailError ||
            passwordError ||
            specialtyError
        )
            throw "Validation error in createDoc!!";
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
            specialty,
            schedules: [],
            address,
            apartment,
            city,
            state,
            zip,
            country,
            coords,
        });
        return {
            docInserted: acknowledged && insertedId,
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
            email,
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

const searchDocs = async (specialtySearch, insuranceSearch) => {
    const docs = await getDocs();
    let doc
    if (specialtySearch == "Specialty" && (insuranceSearch == "Choose your Insurance" || insuranceSearch == "self")) {
        doc = await docs.find({}, {
            projection: {
                password: 0,
                email: 0
            }
        }).toArray();
    } else if (insuranceSearch !== "Choose your Insurance" && insuranceSearch !== "self" && specialtySearch == "Specialty") {
        doc = await docs.find({
            insurance: insuranceSearch
        }, {
            projection: {
                password: 0,
                email: 0
            }
        }).toArray();
    } else if (specialtySearch !== "Specialty" && (insuranceSearch == "Choose your Insurance" || insuranceSearch == "self")) {
        doc = await docs.find({
            specialty: specialtySearch
        }, {
            projection: {
                password: 0,
                email: 0
            }
        }).toArray();
    } else {
        doc = await docs.find({
            specialty: specialtySearch,
            insurance: insuranceSearch
        }, {
            projection: {
                password: 0,
                email: 0
            }
        }).toArray();
    }


    if (!doc) throw `Cannot find doctor with specialty: ${specialtySearch}`;
    return doc;
};


module.exports = {
    createDoc,
    checkDoc,
    isDuplicateEmail,
    getDoctor,
    updateDoctor,
    searchDocs,
};