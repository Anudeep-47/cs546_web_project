const {
    getAppointments,
    ObjectId,
    MongoError
} = require('../config/mongoCollections');


const getUserAppointments = async (userId) => {
    const apptmnts = await getAppointments();
    let userAppointments = await apptmnts.find({
        user_id: userId
    }).toArray();
    if (!userAppointments) throw `Failed to get appointments for user id: ${userId}`;
    return userAppointments;
};

const getDocAppointments = async (docId) => {
    const apptmnts = await getAppointments();
    let docAppointments = apptmnts.find({
        doctor_id: docId
    }).toArray();
    if (!docAppointments) throw `Failed to get appointments for user id: ${docId}`;
    return docAppointments;
};

const createAppointment = async (apptmnt) => {
    const apptmnts = await getAppointments();
    const {
        acknowledged,
        insertedId
    } = await apptmnts.insertOne(apptmnt);
    if (!acknowledged || !insertedId) {
        throw 'Failed to create Appointment';
    }
    delete apptmnt._id;
    apptmnt = {
        _id: insertedId.toString(),
        ...apptmnt
    }
    return apptmnt;
};

const updateAppointment = async (id, {
    new_time
}) => {
    const _id = ObjectId(id);
    const time = new Date(new_time);
    const apptmnts = await getAppointments();
    const res = await apptmnts.findOneAndUpdate({
        _id
    }, {
        '$set': {
            time
        }
    }, {
        returnDocument: 'after'
    });
    const updatedApptmnt = res.value;
    if (updatedApptmnt === null) throw `Failed to update Appointment with id: ${id}`;
    return updatedApptmnt;
};

const getAppointment = async (id) => {
    const _id = ObjectId(id);
    const apptmnts = await getAppointments();
    const apptmnt = apptmnts.find({
        _id
    }).toArray();
    if (!apptmnt) throw `Failed to get appointment with id: ${id}`;
    return apptmnt[0];
};

const deleteAppointment = async (id) => {
    const _id = ObjectId(id);
    const apptmnts = await getAppointments();
    const apptmnt = await getAppointment();
    const res = await apptmnts.deleteOne({
        _id
    });
    if (res.deleteCount === 0) throw `Failed to delete Appointment with id: ${id}`;
    return {
        deleted: true,
        apptmnt
    };
};

const sendEmail = async (data, msg) => {

    var body = msg + " for " + data.firstname + " " + data.lastname + ".\nTime: " + data.appointment_time;

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "medical.consultation.01@gmail.com",
        pass: "onlinemedicalconsultation"
      }
    });

    var mailOptions = {
      from: `"Online Medical Consultation" medical.consultation.01@gmail.com`,
      to : `"${data.email}"`,
      subject: "Online Medical Consultation Appointment Details",
      text: "",
      html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

module.exports = {
    getUserAppointments,
    getDocAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    sendEmail
};