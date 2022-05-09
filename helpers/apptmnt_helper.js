const moment = require('moment');
const nodemailer = require('nodemailer');

const splitAppointments = (apptmnts) => {
    const newApptmnts = [];
    const pastApptmnts = [];
    const now = moment();
    apptmnts.forEach(apptmnt => {
        apptmnt.apptmnt_time = JSON.parse(apptmnt.apptmnt_time);
        const apptmntTime = moment(apptmnt.apptmnt_time);
        if (now < apptmntTime) {
            newApptmnts.push(apptmnt);
        } else {
            pastApptmnts.push(apptmnt);
        }
    });
    return {
        newApptmnts,
        pastApptmnts
    };
};

const prepareAppointments = (apptmnts, others) => {
    apptmnts.forEach((apptmnt, index) => {
        apptmnt._id = apptmnt._id.toString();
        apptmnt.time_string = moment(apptmnt.time).format("MMMM Do, h:mm a");
        const {
            address,
            city,
            state,
            zip
        } = apptmnt.doctor_location;
        apptmnt.doctor_address = `${address}, ${city}, ${state}, ${zip}`;
        if (others && others[index]) {
            Object.keys(others[index]).forEach(key => {
                apptmnt[key] = others[index][key];
            });
        }
    });
};


const sendEmail = async (data, status) => {

    let body = `Dear ${data.patient_name},` +
        `<br>Your Appointment with ${data.doctor_name} has been ${status}.` +
        `<br>Appointment Time: ${moment(data.time).format("MMMM Do, h:mm a")}`;
        
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
        to: `${data.user_email}`,
        subject: `Online Medical Consultation ${status}`,
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
    splitAppointments,
    prepareAppointments,
    sendEmail
};