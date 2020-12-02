/* eslint-disable no-array-constructor */
const blocksServices = require('./BlocksServices');

class DealershipPaymentServices {
  validateDigitableLineDVs(digitableLine) {
    const blockOne = digitableLine.slice(0, 11).split('');
    const dvOne = Number(digitableLine.slice(11, 12));
    const blockTwo = digitableLine.slice(12, 23).split('');
    const dvTwo = Number(digitableLine.slice(23, 24));
    const blockThree = digitableLine.slice(24, 35).split('');
    const dvThree = Number(digitableLine.slice(35, 36));
    const blockFour = digitableLine.slice(36, 47).split('');
    const dvFour = Number(digitableLine.slice(47, 48));

    let digitOneIsValid;
    let digitTwoIsValid;
    let digitThreeIsValid;
    let digitFourIsValid;

    if (digitableLine[2] == '6' || digitableLine[2] == '7') {
      digitOneIsValid = blocksServices.moduleTen(blockOne) == dvOne;
      digitTwoIsValid = blocksServices.moduleTen(blockTwo) == dvTwo;
      digitThreeIsValid = blocksServices.moduleTen(blockThree) == dvThree;
      digitFourIsValid = blocksServices.moduleTen(blockFour) == dvFour;
    } else if (digitableLine[2] === '8' || digitableLine[2] == '9') {
      digitOneIsValid = blocksServices.moduleEleven(blockOne) == dvOne;
      digitTwoIsValid = blocksServices.moduleEleven(blockTwo) == dvTwo;
      digitThreeIsValid = blocksServices.moduleEleven(blockThree) == dvThree;
      digitFourIsValid = blocksServices.moduleEleven(blockFour) == dvFour;
    } else {
      throw new Error('Identificação do valor real ou referência inválido');
    }

    return Array(
      digitOneIsValid,
      digitTwoIsValid,
      digitThreeIsValid,
      digitFourIsValid
    ).every((value) => value === true);
  }

  generateBarCode(digitableLine) {
    const blockOne = digitableLine.slice(0, 11);
    const blockTwo = digitableLine.slice(12, 23);
    const blockThree = digitableLine.slice(24, 35);
    const blockFour = digitableLine.slice(36, 47);

    const barCode = `${blockOne}${blockTwo}${blockThree}${blockFour}`;

    return barCode;
  }

  validateBarcodeDV(barcode, digitableLine) {
    let calculatedDV;
    const barcodeDV = Number(barcode.slice(3, 4));
    const barcodeNumbers = [
      ...barcode.slice(0, 3),
      ...barcode.slice(4, 44),
    ].reverse();

    if (digitableLine[2] === '6' || digitableLine[2] === '7') {
      calculatedDV = blocksServices.moduleTen(barcodeNumbers);
    } else {
      calculatedDV = blocksServices.moduleEleven(barcodeNumbers);
    }

    return calculatedDV === barcodeDV;
  }

  getBilletExpirationDate(barcode) {
    let expirationDateCode;

    if (barcode[1] === '6') {
      expirationDateCode = barcode.slice(26, 34);
    } else {
      expirationDateCode = barcode.slice(19, 27);
    }

    const expirationDate = `${expirationDateCode[4] + expirationDateCode[5]}/${
      expirationDateCode[6] + expirationDateCode[7]
    }/${
      expirationDateCode[0] +
      expirationDateCode[1] +
      expirationDateCode[2] +
      expirationDateCode[3]
    }`;

    return new Date(expirationDate) === 'Data inválida'
      ? 'Sem data de vencimento'
      : expirationDate;
  }

  getBilletAmount(barcode) {
    return barcode[2] === '6' || barcode[2] === '8'
      ? `R$${(Number(barcode.slice(4, 15)) / 100).toFixed(2)}`
      : 'Sem valor';
  }
}

module.exports = new DealershipPaymentServices();
