// const moment = require('moment');



// const createDefaultSchedule = () => {
//     const fromDate = moment();
//     const toDate = moment().add(2, 'weeks');
//     const now = fromDate;
//     const defaultSchedules = [];
//     while (now.isSameOrBefore(toDate)) {
//         const daySchedule = {
//             day: now.format('DD'),
//             month: now.format('MM'),
//             year: now.format('Y'),
//             dayOfWeek: now.format('ddd'),
//             monthName: now.format('MMM'),
//             available: true,
//             startDay: '09:00',
//             endDay: '18:00',
//             sessionTime: 30,
//             breakTimes: []
//         }
//         defaultSchedules.push(daySchedule);
//         now.add(1, 'days');
//     }
//     return defaultSchedules;
// };



// module.exports = {
//     createDefaultSchedule
// }

