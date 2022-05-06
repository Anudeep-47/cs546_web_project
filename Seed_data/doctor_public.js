const mongoCollections = require("../config/mongoCollections");
const doctors = mongoCollections.doctors;
const { ObjectId } = require("mongodb");
// const { doctors } = require("..");

//  Function to create doctors

async function create(firstname, lastname, gender, email, phonenumber, street, city, state, zipcode,longitude,lattitude, qualification, p_speciality,s_speciality, insurance, rating, s_time,o_hours) {
  // validating the poarameters
//   if (arguments.length !== 12) {
//     throw Error("incorrect paramter");
//   }
//   if (
//     first_name == null ||
//     last_name == null ||
//     gender == null ||
//     email == null ||
//     phone_number == null ||
//     address == null ||
//     city == null ||
//     state == null ||
//     zipcode == null ||
//     qualification == null ||
//     speciality == null ||
//     insurance == null
//   ) {
//     throw Error(" INVALID: parameter");
//   }
//   if (typeof first_name != String || typeof last_name != String || typeof gender != String) {
//     throw Error("INVALID: parameter");
//   }

  const new_doctor = {
    first_name: firstname,
    last_name: lastname,
    gender: gender,
    email: email,
    phone_number: phonenumber,
    address: street,
    city: city,
    state: state,
    zip_code: zipcode,
    longitude: longitude,
    lattitude: lattitude,
    qualification: qualification,
    primary_speciality: p_speciality,
    secondary_speciality: s_speciality,
    insurance: insurance,
    rating : rating,
    reviews : [],
    session_time : s_time,
    opening_hours: o_hours
  };
  const doctorCollection = await doctors();
  const new_details = await doctorCollection.insertOne(new_doctor);
  // if(!new_details.acknowledged || !new_details.insertedId) throw 'can not add new doctor'
  const new_data = new_details.insertedId.toString();
  const inserted_doctor = await this.get(new_data);
  inserted_doctor._id = inserted_doctor._id.toString();
  console.log(inserted_doctor);
  return inserted_doctor;
}

//  Function to get get all doctors

const getAll = async function getAll() {
  const doctorCollection = await doctors();
  const doctors_Data = await doctorCollection.find({}).toArray();
  if (doctors_Data == null) {
    throw Error("Could not get all bands");
  }
  doctors_Data.map((x) => {
    x["_id"] = x["_id"].toString();
  });
  return doctors_Data;
};

// Function to get doctors By id

const get = async function get(id) {
  // if(typeof id !== 'string') throw "Invalid id : not a string"
  // if(id === null) throw "Invalid id : null "
  // if(!ObjectId.isValid(id)) throw "Provided object id is invalid"
  const doctorCollection = await doctors();
  const data = await doctorCollection.findOne({ _id: ObjectId(id) });
  // if(data === null) throw "find no band with provided id"
  data["_id"] = data["_id"].toString();
  return data;
};

// // Function to to get doctors By location

// const get = async function get(location) {
//     // if(typeof id !== 'string') throw "Invalid id : not a string"
//     // if(id === null) throw "Invalid id : null "
//     // if(!ObjectId.isValid(id)) throw "Provided object id is invalid"
//     const doctorCollection = await doctors();
//     const data = await doctorCollection.findOne({_id: ObjectId(id)});
//     // if(data === null) throw "find no band with provided id"
//     data["_id"] = data["_id"].toString();
//     return data;
// }

module.exports = {
  create,
  getAll,
  get
};
