const moment = require('moment');


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
        if(others && others[index]){
            Object.keys(others[index]).forEach(key => {
                apptmnt[key] = others[index][key];
            });
        }
    });
};


module.exports = {
    splitAppointments,
    prepareAppointments
};