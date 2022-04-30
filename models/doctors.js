const bcrypt = require("bcrypt");

const { getDocs, ObjectId, MongoError } = require("../config/mongoCollections");

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
  const res = await docs.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: data,
    },
    {
      returnDocument: "after",
    }
  );
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
  country
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
    const { acknowledged, insertedId } = await docs.insertOne({
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

module.exports = {
  createDoc,
  checkDoc,
  isDuplicateEmail,
  getDoctor,
  updateDoctor,
};
