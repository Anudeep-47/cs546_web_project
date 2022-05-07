const {
    getAppointments,
    ObjectId,
    MongoError
} = require('../config/mongoCollections');
const mongoCollections = require("../config/mongoCollections");
const appointment = mongoCollections.appointment;
// const getUserAppointments = async (userId) => {
//     const apptmnts = await getAppointments();
//     let userAppointments = await apptmnts.find({
//         user_id: userId
//     }).toArray();
//     if (!userAppointments) throw `Failed to get appointments for user id: ${userId}`;
//     return userAppointments;
// };

// const getDocAppointments = async (docId) => {
//     const apptmnts = await getAppointments();
//     let docAppointments = apptmnts.find({
//         doctor_id: docId
//     }).toArray();
//     if (!docAppointments) throw `Failed to get appointments for user id: ${docId}`;
//     return docAppointments;
// };

// const createAppointment = async (apptmnt) => {
//     const apptmnts = await getAppointments();
//     const {
//         acknowledged,
//         insertedId
//     } = await apptmnts.insertOne(apptmnt);
//     if (!acknowledged || !insertedId) {
//         throw 'Failed to create Appointment';
//     }
//     delete apptmnt._id;
//     apptmnt = {
//         _id: insertedId.toString(),
//         ...apptmnt
//     }
//     return apptmnt;
// };

async function createAppointment(d_id, p_id, doctorNname, patientName, gender,someoneElse,phoneNumber,
     reason_visit, n_patient, a_time, notes_doctor,status) {
    // Parameters validation
    if (arguments.length !== 12) {
      throw Error("incorrect paramter");
    }
    if (
        d_id == null ||
        p_id == null ||
        doctorNname == null ||
        patientName == null ||
      gender == null ||
      someoneElse == null ||
      phoneNumber == null ||
      reason_visit == null ||
      n_patient == null ||
      a_time == null ||
      notes_doctor == null ||
      status == null
    ) {
      throw Error(" INVALID: parameter");
    }
    if (typeof d_id != 'String' || typeof p_id != 'String' || typeof doctorNname != 'String' || typeof patientName != 'String' || 
      typeof gender != 'String' || typeof someoneElse != 'String' || typeof phoneNumber != 'String' || typeof reason_visit != 'String' || typeof n_patient != 'String' ||
      typeof a_time != 'String' || typeof notes_doctor != 'String' || typeof status != 'String') {
      throw Error("INVALID: parameter");
    }
    if(!Array.isArray(insurance)) {
      throw Error("INVALID: parameter");
    }
  
    const new_d = {
      doctor_id : d_id,
      patient_id : p_id,
      doctor_name: doctorNname,
      patient_name: patientName,
      gender: gender,
      someone_else: someoneElse,
      phone_number: phoneNumber,
      reason_for_visit: reason_visit,
      new_patient: n_patient,
      appointmet_time: a_time,
      notes_to_doctor: notes_doctor,
      status: status,
      created_at: new Date(),
      updated_at: new Date()
    };
    const appointmentCollection = await appointment();
    const new_details = await appointmentCollection.insertOne(new_d);
    // if(!new_details.acknowledged || !new_details.insertedId) throw 'can not add new doctor'
    // const new_data = new_details.insertedId.toString();
    // const inserted_appointment = await this.getAppointment(new_data);
    // inserted_appointment._id = inserted_appointment._id.toString();
    // console.log(inserted_appointment);
    return {inserted : true};
};

// const updateAppointment = async (id, {
//     new_time
// }) => {
//     const _id = ObjectId(id);
//     const time = new Date(new_time);
//     const apptmnts = await getAppointments();
//     const res = await apptmnts.findOneAndUpdate({
//         _id
//     }, {
//         '$set': {
//             time
//         }
//     }, {
//         returnDocument: 'after'
//     });
//     const updatedApptmnt = res.value;
//     if (updatedApptmnt === null) throw `Failed to update Appointment with id: ${id}`;
//     return updatedApptmnt;
// };

// const getAppointment = async (id) => {
//     const _id = ObjectId(id);
//     const apptmnts = await getAppointments();
//     const apptmnt = apptmnts.find({
//         _id
//     }).toArray();
//     if (!apptmnt) throw `Failed to get appointment with id: ${id}`;
//     return apptmnt[0];
// };

// const deleteAppointment = async (id) => {
//     const _id = ObjectId(id);
//     const apptmnts = await getAppointments();
//     const apptmnt = await getAppointment();
//     const res = await apptmnts.deleteOne({
//         _id
//     });
//     if (res.deleteCount === 0) throw `Failed to delete Appointment with id: ${id}`;
//     return {
//         deleted: true,
//         apptmnt
//     };
// };

module.exports = {
    // getUserAppointments,
    // getDocAppointments,
    createAppointment//,
    // updateAppointment,
    // deleteAppointment,
    // getAppointment
};
