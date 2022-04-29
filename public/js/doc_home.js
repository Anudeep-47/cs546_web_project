const scheduleElements = {};
const scheduleArray = [];
let PAGE = 0;

const createRemainingSchedule = (count, curDate, schedules) => {
    while (count--) {
        const daySchedule = {
            day: curDate.format('DD'),
            month: curDate.format('MM'),
            year: curDate.format('Y'),
            dayOfWeek: curDate.format('ddd'),
            monthName: curDate.format('MMM'),
            available: true,
            startDay: '09:00',
            endDay: '18:00',
            sessionTime: 30,
            breakTimes: []
        }
        schedules.push(daySchedule);
        curDate.add(1, 'days');
    }
};

const checkAndFillSchedules = (schedules) => {
    let index = 0;
    let count = 14;
    let curDate = moment();
    while (index < schedules.length) {
        if (count < 1) {
            schedules.splice(index);
            break;
        }
        let curDateStr = `${curDate.format('Y')}-${curDate.format('MM')}-${curDate.format('DD')}`;
        let schdlObj = schedules[index];
        let schdlDateStr = `${schdlObj.year}-${schdlObj.month}-${schdlObj.day}`;
        if (curDateStr === schdlDateStr) {
            count--;
            curDate.add(1, 'days');
            index++;
        } else {
            schedules.splice(index, 1);
        }
    }
    if (count > 0) {
        createRemainingSchedule(count, curDate, schedules);
    }
};

const generateSlotTimes = (sessionTime) => {
    const allSlotTimes = [];
    let mins = 0;
    for (let hr = 0; hr < 24; hr++) {
        while (mins < 60) {
            let value = `${hr.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
            allSlotTimes.push(value);
            mins += sessionTime;
        }
        mins -= 60;
    }
    return allSlotTimes;
};

const createSlotElements = (schdl, allSlotTimes) => {
    const slotElements = [];
    const intervalSlots = allSlotTimes.filter(tSlot => schdl.startDay <= tSlot && tSlot <= schdl.endDay);
    intervalSlots.forEach(tSlot => {
        const slotButton = $('<button>');
        if (schdl.breakTimes.includes(tSlot)) {
            slotButton.addClass('slot btn btn-outline-danger active btn-sm rounded-0 my-1');
        } else {
            slotButton.addClass('slot btn btn-outline-success btn-sm rounded-0 my-1');
        }
        slotButton.text(tSlot);
        slotElements.push(slotButton);
    });
    return slotElements;
};

const createScheduleElements = (schedules) => {
    schedules.forEach(schdl => {
        schdl.available = JSON.parse(schdl.available);
        schdl.sessionTime = JSON.parse(schdl.sessionTime);
        if (!schdl.breakTimes) schdl.breakTimes = [];
        const dayStr = `${schdl.monthName}${schdl.day}`;
        scheduleArray.push(dayStr);
        const allSlotTimes = generateSlotTimes(schdl.sessionTime);
        const slotElements = createSlotElements(schdl, allSlotTimes);
        scheduleElements[dayStr] = {
            ...schdl,
            allSlotTimes,
            slotElements,
        }
    });
};

const renderDayLabels = (day, schdl) => {
    $(`#labelDay${day}`).text(`${schdl.monthName} ${schdl.day} ${schdl.dayOfWeek}`);
    $(`#labelSlotsDay${day}`).text(`${schdl.monthName} ${schdl.day} ${schdl.dayOfWeek}`);
};

const renderDayInfo = (day, {
    available,
    startDay,
    endDay,
    allSlotTimes
}) => {
    $(`#switchDay${day}`).prop('checked', available);
    $(`#labelSwitchDay${day}`).text(available ? 'Available' : 'Unavailable');
    $(`#startDay${day}`).empty();
    $(`#endDay${day}`).empty();
    allSlotTimes.forEach(tSlot => {
        $(`#startDay${day}`).append(`<option ${tSlot===startDay ? 'selected':''} value=${tSlot}>${tSlot}</option>`);
        $(`#endDay${day}`).append(`<option ${tSlot===endDay ? 'selected':''} value=${tSlot}>${tSlot}</option>`);
    });
};

const renderDaySession = (day, {
    sessionTime
}) => {
    $(`#sessionDay${day}`).empty();
    const sessionTimes = [10, 15, 20, 30, 40, 60];
    sessionTimes.forEach(time => $(`#sessionDay${day}`).append(`<option ${time===sessionTime ? 'selected':''} value=${time.toString().padStart(2, "0")}>${time.toString().padStart(2, "0")}</option>`));
};

const renderDaySlots = (day, {
    available,
    slotElements
}) => {
    $(`#slotsDay${day}`).empty();
    if (available) slotElements.forEach(slotButton => $(`#slotsDay${day}`).append(slotButton));
};

const displaySchedule = (page) => {
    for (let index = 0; index < 7; index++) {
        const dayStr = scheduleArray[index + page * 7];
        const schdl = scheduleElements[dayStr];
        renderDayLabels(index + 1, schdl);
        renderDayInfo(index + 1, schdl);
        renderDaySession(index + 1, schdl);
        renderDaySlots(index + 1, schdl);
    }
};

const loadSchedules = () => {
    $.get('/doctor/data', ({
        schedules
    }) => {
        console.log(schedules);
        checkAndFillSchedules(schedules);
        createScheduleElements(schedules);
        displaySchedule(PAGE);
    });
};

loadSchedules();

$('#prevPage').on('click', function (e) {
    e.preventDefault();
    if (PAGE === 1) {
        PAGE = 0;
        displaySchedule(PAGE);
    }
});

$('#nextPage').on('click', function (e) {
    e.preventDefault();
    if (PAGE === 0) {
        PAGE = 1;
        displaySchedule(PAGE);
    }
});

$('.switchDay').on('change', function () {
    const available = !!this.checked;
    const elementId = $(this).attr('id');
    const day = elementId[elementId.length - 1];
    const dayStr = scheduleArray[day - 1 + PAGE * 7];
    const schdl = scheduleElements[dayStr];
    schdl.available = available;
    $(`#labelSwitchDay${day}`).text(available ? 'Available' : 'Unavailable');
    renderDaySlots(day, schdl);
});

$('.sessionDay').on('change', function () {
    const sessionTime = parseInt(this.value);
    const elementId = $(this).attr('id');
    const day = elementId[elementId.length - 1];
    const dayStr = scheduleArray[day - 1 + PAGE * 7];
    const schdl = scheduleElements[dayStr];
    schdl.sessionTime = sessionTime;
    schdl.allSlotTimes = generateSlotTimes(sessionTime);
    schdl.slotElements = createSlotElements(schdl, schdl.allSlotTimes);
    renderDayInfo(day, schdl);
    renderDaySlots(day, schdl);
});

$('.startEndDay').on('change', function () {
    const elementId = $(this).attr('id');
    const day = elementId[elementId.length - 1];
    const dayStr = scheduleArray[day - 1 + PAGE * 7];
    const schdl = scheduleElements[dayStr];
    schdl.startDay = $(`#startDay${day}`)[0].value;
    schdl.endDay = $(`#endDay${day}`)[0].value;
    schdl.slotElements = createSlotElements(schdl, schdl.allSlotTimes);
    renderDaySlots(day, schdl);
});

$(document).on({
    mouseenter: function () {
        $(this).removeClass('btn-outline-success');
        $(this).addClass('btn-outline-danger');
    },
    mouseleave: function () {
        if (!$(this).hasClass('active')) {
            $(this).removeClass('btn-outline-danger');
            $(this).addClass('btn-outline-success');
        }
    },
    click: function () {
        const parentId = $(this).parent().attr('id');
        const day = parentId[parentId.length - 1];
        const dayStr = scheduleArray[day - 1 + PAGE * 7];
        const schdl = scheduleElements[dayStr];
        const tSlot = $(this).text().trim();
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            const index = schdl.breakTimes.indexOf(tSlot);
            if (index > -1) schdl.breakTimes.splice(index, 1);
        } else {
            $(this).addClass('active');
            schdl.breakTimes.push(tSlot);
        }
    }
}, ".slot");

$('#saveSchedules').on('click', function (e) {
    e.preventDefault();
    const schedules = scheduleArray.map(schdlName => {
        const schdl = scheduleElements[schdlName];
        const {
            allSlotTimes,
            slotElements,
            ...schdlDetails
        } = schdl;
        return schdlDetails;
    });
    $.post('/doctor/data', {
        schedules
    }, (response) => {
        console.log(response);
    })
});