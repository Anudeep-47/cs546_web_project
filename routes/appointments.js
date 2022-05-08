const router = require("express").Router();
var nodemailer = require('nodemailer');

const {
    getUserAppointments,
    getDocAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    sendEmail
} = require('../models/appointments');

const {
    addApptmntToDocSchedule,
    removeApptmntFromDocSchedule
} = require('../controllers/doctors');

const {
    prepareAppointments
} = require('../helpers/apptmnt_helper');



router.get('/', async (req, res) => {
    if (req.session.user) {
        if (!req.session.user.id) throw "User id undefined";
        const userId = req.session.user.id;
        const apptmnts = await getUserAppointments(userId);
        prepareAppointments(apptmnts);
        if (apptmnts) {
            res.render("pages/booking-form", { data: apptmnts });
        } else {
            res.render("pages/booking-form", {
                isNew: ['Yes', 'No'],
                isElse: ['Yes', 'No'],
                gender: ['Male', 'Female', 'Prefer not to answer']
            });
        }
    } else if (req.session.doctor) {
        const docId = req.session.doctor.id;
        if (!req.session.doctor.id) throw "Doctor id undefined";
        const apptmnts = await getDocAppointments(docId);
        if (apptmnts) {
            prepareAppointments(apptmnts);
            res.render("pages/booking-form", { data: apptmnts });
        } else {
            res.render("pages/booking-form", {
                isNew: ['Yes', 'No'],
                isElse: ['Yes', 'No'],
                gender: ['Male', 'Female', 'Prefer not to answer']
            });
        }
    } else {
        res.redirect('/');
    }
});

router.post('/:id', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const id = req.params.id;
        const apptmnt = req.body.data;
        if (!id || !apptmnt) throw "Undefined parameters";
        await removeApptmntFromDocSchedule(apptmnt);
        const updatedApptmnt = await updateAppointment(id, apptmnt);
        if (updatedApptmnt) {
            await addApptmntToDocSchedule(updatedApptmnt);
            prepareAppointments([updatedApptmnt]);
            await sendEmail(apptmnt, "Appointment booked");
            res.render("pages/booking-form", { data: apptmnt });
        } else {
            res.render('pages/booking-form', {
                title: "Booking",
                error: "Internal Server Error"
            });
        }
        await sendEmail(updatedApptmnt, "Appointment booked");
        res.render("pages/booking-form", { data: updatedApptmnt });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const id = req.params.id;
        if (!id) throw "Id undefined";
        const result = await deleteAppointment(id);
        if (result.deleted) {
            await sendEmail(result.apptmnt, "Appointment deleted");
            await removeApptmntFromDocSchedule(result.apptmnt);
            res.redirect('/user/booking');
            //res.json('Successfully deleted Appointment');
        } else {
            res.render('pages/booking-form', {
                title: "Booking",
                error: "Internal Server Error"
            });
        }
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const apptmntData = req.body.data;
        if (!apptmntData) throw "Undefined parameters";
        const apptmnt = await createAppointment(apptmntData);
        if (apptmnt) {
            await addApptmntToDocSchedule(apptmnt);
            await sendEmail(apptmnt, "Appointment booked");
            res.render("pages/booking-form", { data: apptmnt });
        } else {
            res.render('pages/booking-form', {
                title: "Booking",
                error: "Internal Server Error"
            });
        }
    }
});

module.exports = router;