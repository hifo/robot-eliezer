import { expect } from 'chai';
import { getHebrewDate, getHolidays, getHolidaysNext10Days, locationsList } from '../helper.js';

describe('Helper Functions', () => {
  describe('getHebrewDate()', () => {
    it('should return an object with hebrewDateInHebrew and hebrewDateInEnglish properties', () => {
      const result = getHebrewDate();
      expect(result).to.have.property('hebrewDateInHebrew');
      expect(result).to.have.property('hebrewDateInEnglish');
    });

    it('should return non-empty string values', () => {
      const result = getHebrewDate();
      expect(result.hebrewDateInHebrew).to.be.a('string').that.is.not.empty;
      expect(result.hebrewDateInEnglish).to.be.a('string').that.is.not.empty;
    });
  });

  describe('getHolidays()', () => {
    it('should return an object with holidaysToday and holidaysTodayAshki properties', () => {
      const result = getHolidays();
      expect(result).to.have.property('holidaysToday');
      expect(result).to.have.property('holidaysTodayAshki');
    });

    it('should return arrays', () => {
      const result = getHolidays();
      expect(result.holidaysToday).to.be.an('array');
      expect(result.holidaysTodayAshki).to.be.an('array');
    });

    it('should have equal length arrays', () => {
      const result = getHolidays();
      expect(result.holidaysToday.length).to.equal(result.holidaysTodayAshki.length);
    });

    it('should accept a location parameter', () => {
      const result = getHolidays('Tel Aviv');
      expect(result).to.have.property('holidaysToday');
      expect(result).to.have.property('holidaysTodayAshki');
    });

    it('should work with default location (Jerusalem)', () => {
      const result = getHolidays();
      expect(result).to.not.be.null;
    });
  });

  describe('getHolidaysNext10Days()', () => {
    it('should return an object with holidaysToday and holidaysTodayAshki properties', () => {
      const result = getHolidaysNext10Days();
      expect(result).to.have.property('holidaysToday');
      expect(result).to.have.property('holidaysTodayAshki');
    });

    it('should return arrays', () => {
      const result = getHolidaysNext10Days();
      expect(result.holidaysToday).to.be.an('array');
      expect(result.holidaysTodayAshki).to.be.an('array');
    });

    it('should have equal length arrays', () => {
      const result = getHolidaysNext10Days();
      expect(result.holidaysToday.length).to.equal(result.holidaysTodayAshki.length);
    });

    it('should accept a location parameter', () => {
      const result = getHolidaysNext10Days('New York');
      expect(result).to.have.property('holidaysToday');
      expect(result).to.have.property('holidaysTodayAshki');
    });
  });

  describe('locationsList', () => {
    it('should be an array', () => {
      expect(locationsList).to.be.an('array');
    });

    it('should not be empty', () => {
      expect(locationsList).to.not.be.empty;
    });

    it('should contain Jerusalem', () => {
      expect(locationsList).to.include('Jerusalem');
    });

    it('should contain Tel Aviv', () => {
      expect(locationsList).to.include('Tel Aviv');
    });

    it('should contain New York', () => {
      expect(locationsList).to.include('New York');
    });

    it('should have unique entries', () => {
      const unique = new Set(locationsList);
      expect(locationsList.length).to.equal(unique.size);
    });
  });
});
