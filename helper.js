import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';

export const locationsList = ['Ashdod', 'Atlanta', 'Austin', 
    'Baghdad', 'Beer Sheva', 'Berlin', 'Baltimore', 'Bogota', 'Boston', 'Budapest', 'Buenos Aires', 'Buffalo', 
    'Chicago', 'Cincinnati', 'Cleveland', 
    'Dallas', 'Denver', 'Detroit', 
    'Eilat', 
    'Gibraltar', 
    'Haifa', 'Hawaii', 'Helsinki', 'Houston', 
    'Jerusalem', 'Johannesburg', 
    'Kiev', 
    'La Paz', 'Livingston', 'Las Vegas', 'London', 'Los Angeles', 
    'Marseilles', 'Miami', 'Minneapolis', 'Melbourne', 'Mexico City', 'Montreal', 'Moscow', 
    'New York', 
    'Omaha', 'Ottawa', 
    'Panama City', 'Paris', 'Pawtucket', 'Petach Tikvah', 'Philadelphia', 'Phoenix', 'Pittsburgh', 'Providence', 'Portland', 
    'Saint Louis', 'Saint Petersburg', 'San Diego', 'San Francisco', 'Sao Paulo', 'Seattle', 'Sydney', 
    'Tel Aviv', 'Tiberias', 'Toronto', 
    'Vancouver', 'White Plains', 'Washington DC', 'Worcester'];

function getOptionsTodayWithLocation(locationName = 'Jerusalem') {
  return {
    location: Location.lookup(locationName),
    omer: true,
    sedrot: true,
    candlelighting: true,
    havdalahMins: true,
    shabbatMevarchim: true,
    molad: true,
    yomKippurKatan: true,
    yizkor: true
  };
}

function getOptionsSatCalWithLocation(locationName = 'Jerusalem') {
  return {
    location: Location.lookup(locationName),
    omer: false,
    sedrot: true,
    candlelighting: true,
    havdalahMins: true,
    shabbatMevarchim: false,
    molad: false,
    yomKippurKatan: true,
    yizkor: true
  };
}

function getOptionsOutlookWithLocation(locationName = 'Jerusalem') {
  return {
    location: Location.lookup(locationName),
    omer: false,
    sedrot: true,
    candlelighting: true,
    havdalahMins: true,
    shabbatMevarchim: true,
    molad: true,
    yomKippurKatan: true,
    yizkor: true
  };
}

export function getHebrewDate() {
  const today = new Date();
  const hebrewDate = new HDate(today);
  return { hebrewDateInHebrew: hebrewDate.renderGematriya(), hebrewDateInEnglish: hebrewDate.render() };
}

export function getHolidays(locationName = 'Jerusalem') {
    const events = HebrewCalendar.calendar(getOptionsTodayWithLocation(locationName));
    const satEvents = HebrewCalendar.calendar(getOptionsSatCalWithLocation(locationName));
    
    var holidaysToday = [];
    var holidaysTodayAshki = [];
    
    const today = new Date();
    const isFriday = today.getDay() === 5;
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    for (const event of events) {
        const hd = event.getDate();
        const date = hd.greg();
        
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        
        if (isToday) {
            holidaysToday.push(event.render('en'));
            holidaysTodayAshki.push(event.render('ashkenazi'));
        }
    }
    
    // On Friday, include Saturday events from satEvents calendar
    if (isFriday) {
        for (const event of satEvents) {
            const hd = event.getDate();
            const date = hd.greg();
            
            const isTomorrow = date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();
            
            if (isTomorrow) {
                holidaysToday.push(event.render('en'));
                holidaysTodayAshki.push(event.render('ashkenazi'));
            }
        }
    }
    
    return { holidaysToday, holidaysTodayAshki };
}

export function getHolidaysNext10Days(locationName = 'Jerusalem') {
    const events = HebrewCalendar.calendar(getOptionsOutlookWithLocation(locationName));
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
    return { holidaysToday, holidaysTodayAshki };
}