const router = require("express").Router();


const {
    getUserAppointments,
    getDocAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment
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
        const userId = req.session.user.id;
        const apptmnts = await getUserAppointments(userId);
        prepareAppointments(apptmnts);
        res.json({
            apptmnts
        });
    } else if (req.session.doctor) {
        const docId = req.session.doctor.id;
        const apptmnts = await getDocAppointments(docId);
        prepareAppointments(apptmnts);
        res.json({
            apptmnts
        });
    } else {
        res.redirect('/');
    }
});

router.post('/:id', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const id = req.params.id;
        const apptmnt = req.body.updatedApptmnt;
        await removeApptmntFromDocSchedule(apptmnt);
        const updatedApptmnt = await updateAppointment(id, apptmnt);
        await addApptmntToDocSchedule(updatedApptmnt);
        prepareAppointments([updatedApptmnt]);
        res.json({
            updatedApptmnt
        });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const id = req.params.id;
        const result = await deleteAppointment(id);
        if(result.deleted) {
            await removeApptmntFromDocSchedule(result.apptmnt);
            res.json('Successfully deleted Appointment');
        }
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const apptmntData = req.body.apptmnt;
        const apptmnt = await createAppointment(apptmntData);
        await addApptmntToDocSchedule(apptmnt);
        res.json(apptmnt);
    }
});

module.exports = router;