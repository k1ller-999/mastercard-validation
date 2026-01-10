const { expect } = require('chai');
const { it, describe } = require('mocha');
const creditors = require('..');

describe('Test mastercard-validation functions', () => {
  describe('#validateMasterCard()', () => {
    it('should return invalid response if there is no card', done => {
      const validation = creditors.validateMasterCard();
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
        number: '5325921353426270',
        expiryMonth: '01',
        expiryYear: '26',
        cvv: '116',
      };
      const validation = creditors.validateMasterCard(card);
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
        number: '5325921353426277',
        expiryMonth: '01',
        expiryYear: '26',
        cvv: '116',
      };
      const validation = creditors.validateMasterCard(card);
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
      expect(creditors.isValidCardNumber('5267417426560259')).to.equal(true);
      expect(creditors.isValidCardNumber('5429339123914800')).to.equal(true);
      expect(creditors.isValidCardNumber('5555555555554444')).to.equal(true);
      done();
    });
    it('should return false for numbers that pass luhn but does not has mastercard code Pattern', done => {
      expect(creditors.isValidCardNumber('5610591081018250')).to.equal(false);
      expect(creditors.isValidCardNumber('3566002020360505')).to.equal(false);
      expect(creditors.isValidCardNumber('6331101999990016')).to.equal(false);
      done();
    });
  });

  describe('#hasMasterCardPatterns()', () => {
    it('should return true for correct mastercard code pattern', done => {
      expect(creditors.hasMasterCardPatterns(5489876561389844)).to.equal(true);
      expect(creditors.hasMasterCardPatterns('5110681872341907')).to.equal(true);
      done();
    });
    it('should return false for wrong mastercard code pattern', done => {
      expect(creditors.hasMasterCardPatterns(54898765613844)).to.equal(false);
      expect(creditors.hasMasterCardPatterns('5110681841907')).to.equal(false);
      done();
    });
  });

  describe('#luhn()', () => {
    it('should return true for valid credit card code', done => {
      expect(creditors.luhn('378734493671000')).to.equal(true);
      expect(creditors.luhn('5610591081018250')).to.equal(true);
      expect(creditors.luhn('3566002020360505')).to.equal(true);
      expect(creditors.luhn('5555555555554444')).to.equal(true);
      expect(creditors.luhn('6331101999990016')).to.equal(true);
      done();
    });
    it('should return false for invalid credit card code', done => {
      expect(creditors.luhn('5105105105105101')).to.equal(false);
      expect(creditors.luhn('4111111111111112')).to.equal(false);
      expect(creditors.luhn(378734493671000)).to.equal(false);
      expect(creditors.luhn(5610591081018250)).to.equal(false);
      expect(creditors.luhn(3566002020360505)).to.equal(false);
      expect(creditors.luhn(5555555555554444)).to.equal(false);
      expect(creditors.luhn(6331101999990016)).to.equal(false);
      expect(creditors.luhn('')).to.equal(false);
      expect(creditors.luhn(null)).to.equal(false);
      expect(creditors.luhn({})).to.equal(false);
      expect(creditors.luhn(' ')).to.equal(false);
      expect(creditors.luhn(undefined)).to.equal(false);
      expect(creditors.luhn([])).to.equal(false);
      expect(creditors.luhn('abc')).to.equal(false);
      done();
    });
  });

  describe('#isValidCvv()', () => {
    it('should return true for valid cvv', done => {
      expect(creditors.isValidCvv(213)).to.equal(true);
      expect(creditors.isValidCvv('123')).to.equal(true);
      done();
    });
    it('should return false for invalid cvv', done => {
      expect(creditors.isValidCvv(13)).to.equal(false);
      expect(creditors.isValidCvv(1113)).to.equal(false);
      expect(creditors.isValidCvv(14)).to.equal(false);
      expect(creditors.isValidCvv('1')).to.equal(false);
      expect(creditors.isValidCvv('')).to.equal(false);
      expect(creditors.isValidCvv(null)).to.equal(false);
      expect(creditors.isValidCvv({})).to.equal(false);
      expect(creditors.isValidCvv(' ')).to.equal(false);
      expect(creditors.isValidCvv(undefined)).to.equal(false);
      expect(creditors.isValidCvv([])).to.equal(false);
      expect(creditors.isValidCvv('abc')).to.equal(false);
      done();
    });
  });

  describe('#isExpired()', () => {
    it('should return true if the credit card has expired', done => {
      expect(creditors.isExpired(2, 2013)).to.equal(true);
      done();
    });
    it('should return false if the credit card has not expired', done => {
      expect(creditors.isExpired(9, 2100)).to.equal(false);
      done();
    });
    it('should return true when the card has expired last month', done => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      expect(creditors.isExpired(date.getMonth() + 1, date.getFullYear())).to.equal(true);
      done();
    });
    it('should return false when the card is expiring this month', done => {
      const date = new Date();
      expect(creditors.isExpired(date.getMonth() + 1, date.getFullYear())).to.equal(false);
      done();
    });
  });

  describe('#isValidExpiryYear()', () => {
    it('should return true for valid expiry year', done => {
      expect(creditors.isValidExpiryYear(2100)).to.equal(true);
      expect(creditors.isValidExpiryYear(2000)).to.equal(true);
      expect(creditors.isValidExpiryYear(2016)).to.equal(true);
      expect(creditors.isValidExpiryYear('2100')).to.equal(true);
      expect(creditors.isValidExpiryYear('2000')).to.equal(true);
      expect(creditors.isValidExpiryYear('2017')).to.equal(true);
      done();
    });
    it('should return false for invalid expiry year', done => {
      expect(creditors.isValidExpiryYear('AZ12')).to.equal(false);
      expect(creditors.isValidExpiryYear(212)).to.equal(false);
      expect(creditors.isValidExpiryYear(12333)).to.equal(false);
      expect(creditors.isValidExpiryYear('A1512')).to.equal(false);
      expect(creditors.isValidExpiryYear(1999)).to.equal(false);
      expect(creditors.isValidExpiryYear(2101)).to.equal(false);
      expect(creditors.isValidExpiryYear('')).to.equal(false);
      expect(creditors.isValidExpiryYear(null)).to.equal(false);
      expect(creditors.isValidExpiryYear({})).to.equal(false);
      expect(creditors.isValidExpiryYear(' ')).to.equal(false);
      expect(creditors.isValidExpiryYear(undefined)).to.equal(false);
      expect(creditors.isValidExpiryYear([])).to.equal(false);
      done();
    });
  });

  describe('#isValidExpiryMonth()', () => {
    it('should return true for valid expiry month', done => {
      expect(creditors.isValidExpiryMonth(1)).to.equal(true);
      expect(creditors.isValidExpiryMonth(12)).to.equal(true);
      expect(creditors.isValidExpiryMonth(2)).to.equal(true);
      expect(creditors.isValidExpiryMonth(6)).to.equal(true);
      expect(creditors.isValidExpiryMonth('2')).to.equal(true);
      expect(creditors.isValidExpiryMonth('09')).to.equal(true);
      done();
    });
    it('should return false for invalid expiry month', done => {
      expect(creditors.isValidExpiryMonth(0)).to.equal(false);
      expect(creditors.isValidExpiryMonth(13)).to.equal(false);
      expect(creditors.isValidExpiryMonth('a2')).to.equal(false);
      expect(creditors.isValidExpiryMonth('')).to.equal(false);
      expect(creditors.isValidExpiryMonth(null)).to.equal(false);
      expect(creditors.isValidExpiryMonth({})).to.equal(false);
      expect(creditors.isValidExpiryMonth(' ')).to.equal(false);
      expect(creditors.isValidExpiryMonth(undefined)).to.equal(false);
      expect(creditors.isValidExpiryMonth([])).to.equal(false);
      done();
    });
    it('should return false for string invalid months', done => {
      expect(creditors.isValidExpiryMonth('123')).to.equal(false);
      done();
    });
  });
});
