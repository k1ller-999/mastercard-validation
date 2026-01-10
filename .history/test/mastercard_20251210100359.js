const { expect } = require('chai');
const { it, describe } = require('mocha');
const  = require('..');

describe('Test mastercard-validation functions', () => {
  describe('#validateMasterCard()', () => {
    it('should return invalid response if there is no card', done => {
      const validation = .validateMasterCard();
      expect(validation.card).to.deep.equal({});
      expect(validation.validCardNumber).to.equal(false);
      expect(validation.validExpiryMonth).to.equal(false);
      expect(validation.validExpiryYear).to.equal(false);
      expect(validation.validCvv).to.equal(false);
      expect(validation.isExpired).to.equal(false);
      done();
    });
    it('should return invalid response on invalid card', done => {
      const card = {
        number: '4111111111111112',
        expiryMonth: '13',
        expiryYear: '2100',
        cvv: '463',
      };
      const validation = .validateMasterCard(card);
      expect(validation.card).to.equal(card);
      expect(validation.validCardNumber).to.equal(false);
      expect(validation.validExpiryMonth).to.equal(false);
      expect(validation.validExpiryYear).to.equal(true);
      expect(validation.validCvv).to.equal(true);
      expect(validation.isExpired).to.equal(false);
      done();
    });
    it('should return valid response on valid card', done => {
      const card = {
        number: '5430574372474752',
        expiryMonth: '05',
        expiryYear: '2100',
        cvv: '087',
      };
      const validation = .validateMasterCard(card);
      expect(validation.card).to.equal(card);
      expect(validation.validCardNumber).to.equal(true);
      expect(validation.validExpiryMonth).to.equal(true);
      expect(validation.validExpiryYear).to.equal(true);
      expect(validation.validCvv).to.equal(true);
      expect(validation.isExpired).to.equal(false);
      done();
    });
  });

  describe('#isValidCardNumber()', () => {
    it('should return true for valid card code numbers', done => {
      expect(.isValidCardNumber('5267417426560259')).to.equal(true);
      expect(.isValidCardNumber('5429339123914800')).to.equal(true);
      expect(.isValidCardNumber('5555555555554444')).to.equal(true);
      done();
    });
    it('should return false for numbers that pass luhn but does not has mastercard code Pattern', done => {
      expect(.isValidCardNumber('5610591081018250')).to.equal(false);
      expect(.isValidCardNumber('3566002020360505')).to.equal(false);
      expect(.isValidCardNumber('6331101999990016')).to.equal(false);
      done();
    });
  });

  describe('#hasMasterCardPatterns()', () => {
    it('should return true for correct mastercard code pattern', done => {
      expect(.hasMasterCardPatterns(5489876561389844)).to.equal(true);
      expect(.hasMasterCardPatterns('5110681872341907')).to.equal(true);
      done();
    });
    it('should return false for wrong mastercard code pattern', done => {
      expect(.hasMasterCardPatterns(54898765613844)).to.equal(false);
      expect(.hasMasterCardPatterns('5110681841907')).to.equal(false);
      done();
    });
  });

  describe('#luhn()', () => {
    it('should return true for valid credit card code', done => {
      expect(.luhn('378734493671000')).to.equal(true);
      expect(.luhn('5610591081018250')).to.equal(true);
      expect(.luhn('3566002020360505')).to.equal(true);
      expect(.luhn('5555555555554444')).to.equal(true);
      expect(.luhn('6331101999990016')).to.equal(true);
      done();
    });
    it('should return false for invalid credit card code', done => {
      expect(.luhn('5105105105105101')).to.equal(false);
      expect(.luhn('4111111111111112')).to.equal(false);
      expect(.luhn(378734493671000)).to.equal(false);
      expect(.luhn(5610591081018250)).to.equal(false);
      expect(.luhn(3566002020360505)).to.equal(false);
      expect(.luhn(5555555555554444)).to.equal(false);
      expect(.luhn(6331101999990016)).to.equal(false);
      expect(.luhn('')).to.equal(false);
      expect(.luhn(null)).to.equal(false);
      expect(.luhn({})).to.equal(false);
      expect(.luhn(' ')).to.equal(false);
      expect(.luhn(undefined)).to.equal(false);
      expect(.luhn([])).to.equal(false);
      expect(.luhn('abc')).to.equal(false);
      done();
    });
  });

  describe('#isValidCvv()', () => {
    it('should return true for valid cvv', done => {
      expect(.isValidCvv(213)).to.equal(true);
      expect(.isValidCvv('123')).to.equal(true);
      done();
    });
    it('should return false for invalid cvv', done => {
      expect(.isValidCvv(13)).to.equal(false);
      expect(.isValidCvv(1113)).to.equal(false);
      expect(.isValidCvv(14)).to.equal(false);
      expect(.isValidCvv('1')).to.equal(false);
      expect(.isValidCvv('')).to.equal(false);
      expect(.isValidCvv(null)).to.equal(false);
      expect(.isValidCvv({})).to.equal(false);
      expect(.isValidCvv(' ')).to.equal(false);
      expect(.isValidCvv(undefined)).to.equal(false);
      expect(.isValidCvv([])).to.equal(false);
      expect(.isValidCvv('abc')).to.equal(false);
      done();
    });
  });

  describe('#isExpired()', () => {
    it('should return true if the credit card has expired', done => {
      expect(.isExpired(2, 2013)).to.equal(true);
      done();
    });
    it('should return false if the credit card has not expired', done => {
      expect(.isExpired(9, 2100)).to.equal(false);
      done();
    });
    it('should return true when the card has expired last month', done => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      expect(.isExpired(date.getMonth() + 1, date.getFullYear())).to.equal(true);
      done();
    });
    it('should return false when the card is expiring this month', done => {
      const date = new Date();
      expect(.isExpired(date.getMonth() + 1, date.getFullYear())).to.equal(false);
      done();
    });
  });

  describe('#isValidExpiryYear()', () => {
    it('should return true for valid expiry year', done => {
      expect(.isValidExpiryYear(2100)).to.equal(true);
      expect(.isValidExpiryYear(2000)).to.equal(true);
      expect(.isValidExpiryYear(2016)).to.equal(true);
      expect(.isValidExpiryYear('2100')).to.equal(true);
      expect(.isValidExpiryYear('2000')).to.equal(true);
      expect(.isValidExpiryYear('2017')).to.equal(true);
      done();
    });
    it('should return false for invalid expiry year', done => {
      expect(.isValidExpiryYear('AZ12')).to.equal(false);
      expect(.isValidExpiryYear(212)).to.equal(false);
      expect(.isValidExpiryYear(12333)).to.equal(false);
      expect(.isValidExpiryYear('A1512')).to.equal(false);
      expect(.isValidExpiryYear(1999)).to.equal(false);
      expect(.isValidExpiryYear(2101)).to.equal(false);
      expect(.isValidExpiryYear('')).to.equal(false);
      expect(.isValidExpiryYear(null)).to.equal(false);
      expect(.isValidExpiryYear({})).to.equal(false);
      expect(.isValidExpiryYear(' ')).to.equal(false);
      expect(.isValidExpiryYear(undefined)).to.equal(false);
      expect(.isValidExpiryYear([])).to.equal(false);
      done();
    });
  });

  describe('#isValidExpiryMonth()', () => {
    it('should return true for valid expiry month', done => {
      expect(.isValidExpiryMonth(1)).to.equal(true);
      expect(.isValidExpiryMonth(12)).to.equal(true);
      expect(.isValidExpiryMonth(2)).to.equal(true);
      expect(.isValidExpiryMonth(6)).to.equal(true);
      expect(.isValidExpiryMonth('2')).to.equal(true);
      expect(.isValidExpiryMonth('09')).to.equal(true);
      done();
    });
    it('should return false for invalid expiry month', done => {
      expect(.isValidExpiryMonth(0)).to.equal(false);
      expect(.isValidExpiryMonth(13)).to.equal(false);
      expect(.isValidExpiryMonth('a2')).to.equal(false);
      expect(.isValidExpiryMonth('')).to.equal(false);
      expect(.isValidExpiryMonth(null)).to.equal(false);
      expect(.isValidExpiryMonth({})).to.equal(false);
      expect(.isValidExpiryMonth(' ')).to.equal(false);
      expect(.isValidExpiryMonth(undefined)).to.equal(false);
      expect(.isValidExpiryMonth([])).to.equal(false);
      done();
    });
    it('should return false for string invalid months', done => {
      expect(.isValidExpiryMonth('123')).to.equal(false);
      done();
    });
  });
});
