import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';

const optionsToday = {
    location: Location.lookup('New York'),
    omer: true,
    sedrot: true,
    candlelighting: true,
    havdalahMins: true,
    shabbatMevarchim: true,
    molad: true,
    yomKippurKatan: true,
    yizkor: true
}

const optionsOutlook = {
    location: Location.lookup('New York'),
    omer: false,
    sedrot: true,
    candlelighting: true,
    havdalahMins: true,
    shabbatMevarchim: true,
    molad: true,
    yomKippurKatan: true,
    yizkor: true
}

export function getHebrewDate() {
  const today = new Date();
  const hebrewDate = new HDate(today);
  return { hebrewDateInHebrew: hebrewDate.renderGematriya(), hebrewDateInEnglish: hebrewDate.render() };
}

export function getHolidays() {
    const events = HebrewCalendar.calendar(optionsToday);
    var holidaysToday = [];
    var holidaysTodayAshki = [];
    for (const event of events) {
        const hd = event.getDate();
        const date = hd.greg();
        const today = new Date();
        if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
            holidaysToday.push(event.render('en'));
            holidaysTodayAshki.push(event.render('ashkenazi'));
        }
    }
    console.log(holidaysToday);
    console.log(holidaysTodayAshki);
    return { holidaysToday, holidaysTodayAshki };
}

export function getHolidaysNext10Days() {
    const events = HebrewCalendar.calendar(optionsOutlook);
    var holidaysToday = [];
    var holidaysTodayAshki = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);
    
    for (const event of events) {
        const hd = event.getDate();
        const date = new Date(hd.greg());
        date.setHours(0, 0, 0, 0);
        
        // Check if date is after today and within the next 10 days
        if (date > today && date <= tenDaysFromNow) {
            holidaysToday.push(event.render('en') + ` (${date.toDateString()})`);
            holidaysTodayAshki.push(event.render('ashkenazi') + ` (${date.toDateString()})`);
        }
    }
    console.log(holidaysToday);
    console.log(holidaysTodayAshki);
    return { holidaysToday, holidaysTodayAshki };
}