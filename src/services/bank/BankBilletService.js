/* eslint-disable eqeqeq */
/* eslint-disable no-array-constructor */
const fieldsServices = require('./FieldService');

class BankBilletServices {
  // Calculate verification digit
  validateDigitableLineDVs(digitableLine) {
    // Getting free fields and verification digits
    const fieldOne = digitableLine.slice(0, 9).split('').reverse();
    const dvOne = Number(digitableLine.slice(9, 10));
    const fieldTwo = digitableLine.slice(10, 20).split('').reverse();
    const dvTwo = Number(digitableLine.slice(20, 21));
    const fieldThree = digitableLine.slice(21, 31).split('').reverse();
    const dvThree = Number(digitableLine.slice(31, 32));

    const fieldOneTotal = fieldsServices.fieldTotal(fieldOne);
    const fieldTwoTotal = fieldsServices.fieldTotal(fieldTwo);
    const fieldThreeTotal = fieldsServices.fieldTotal(fieldThree);

    // Validate verification digit
    const digitOneIsValid = fieldsServices.validateDV(fieldOneTotal, dvOne);
    const digitTwoIsValid = fieldsServices.validateDV(fieldTwoTotal, dvTwo);
    const digitThreeIsValid = fieldsServices.validateDV(
      fieldThreeTotal,
      dvThree
    );

    // Validate if all digits are valids
    const result = Array(
      digitOneIsValid,
      digitTwoIsValid,
      digitThreeIsValid
    ).every((value) => value === true);

    return result;
  }

  generateBarCode(digitableLine) {
    const bankAndCurrencyCode = digitableLine.slice(0, 4);
    const positionOne = digitableLine.slice(4, 9);
    const positionTwo = digitableLine.slice(10, 20);
    const positionThree = digitableLine.slice(21, 31);
    const barCodeDigit = digitableLine.slice(32, 33);
    const dueDateAndValue = digitableLine.slice(33, 47);

    const barCode = `${bankAndCurrencyCode}${barCodeDigit}${dueDateAndValue}${positionOne}${positionTwo}${positionThree}`;

    return barCode;
  }

  validadeBarCodeDV(barcode) {
    const barcodeDV = barcode.slice(4, 5);
    const barcodeNumbers = [
      ...barcode.slice(0, 4),
      ...barcode.slice(5, 44),
    ].reverse();
    let multiplier = 2;

    const barcodeTotal = barcodeNumbers
      .map((number) => {
        const result = Number(number) * multiplier;
        multiplier = multiplier === 9 ? 2 : (multiplier += 1);
        return result;
      })
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });

    let calculatedDV = 11 - (barcodeTotal % 11);

    calculatedDV =
      calculatedDV === 0 || calculatedDV === 10 || calculatedDV === 11
        ? 1
        : calculatedDV;

    return calculatedDV == barcodeDV;
  }

  getBankBilletExpirationDate(barcode) {
    const expirationDateFactor = barcode.slice(5, 9);
    const baseDate = new Date('10/07/1997');
    const futureBaseDate = new Date('02/22/2025');

    if (expirationDateFactor * 1 === 0) return 'Sem data de vencimento';

    let expirationDate;
    if (new Date() < futureBaseDate) {
      expirationDate = new Date(baseDate);
      expirationDate.setDate(
        expirationDate.getDate() + Number(expirationDateFactor)
      );
    } else {
      expirationDate = new Date(futureBaseDate);
      const futureExpirationDateFactor = Number(expirationDateFactor) % 1000;
      expirationDate.setDate(
        expirationDate.getDate() + futureExpirationDateFactor
      );
    }

    return `${expirationDate.getDate()}/${
      expirationDate.getMonth() + 1
    }/${expirationDate.getFullYear()}`;
  }

  getBankBilletAmount(barcode) {
    const amount = (Number(barcode.slice(9, 19)) / 100).toFixed(2);
    return `R$${amount}`;
  }
}

module.exports = new BankBilletServices();
