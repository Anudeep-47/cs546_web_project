var casual = require("casual");
const bcrypt = require("bcrypt");
const axios = require("axios").default;

const { getDocs, ObjectId } = require("./../config/mongoCollections");
const { closeConnection } = require("./../config/mongoConnection");

const createDoc = async () => {
  let coords;
  let specialty = [
    "Acupuncturist",
    "Addiction Specialist",
    "Adult Nurse Practitioner",
  ];
  let schedules = [];
  let insurance = [
    "Aetna",
    "Cigna",
    "United Healthcare",
    "Humana",
    "Kaiser Foundation",
    "Centene Corporation",
  ];
  const randomSpecialty = Math.floor(Math.random() * specialty.length);
  const randomInsurance = Math.floor(Math.random() * insurance.length);
  async function getloc(fadd) {
    var { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${fadd}&key=AIzaSyBFYx4flUaipnwrahPBPcFqVLqkKyLwVnE`
    );
    if (data.results[0]) {
      data = data.results[0].geometry.location;
    } else {
      data = { lat: casual.latitude, lng: casual.longitude };
    }

    return data;
  }

  firstname = casual.first_name;
  lastname = casual.last_name;
  email = casual.email;
  password = casual.password;
  specialty = specialty[randomSpecialty];
  address = casual.address1;
  apartment = "";
  city = casual.city;
  state = casual.state;
  zip = casual.zip(5);
  country = casual.country;
  insurance = insurance[randomInsurance];

  const fullAddress = address + " " + city + " " + " " + state + " " + zip;
  coords = await getloc(fullAddress);
  const saltRounds = 1;
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
    coords,
    insurance,
  });
  return {
    docInserted: acknowledged && insertedId,
  };
};

async function main() {
  for (var i = 0; i < 10; i++) {
    await createDoc();
  }
  await closeConnection();
}
main();
