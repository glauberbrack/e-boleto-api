const bankBilletServices = require('../services/bank/BankBilletService');
const dealershipPaymentServices = require('../services/dealership/DealershipPaymentService');

module.exports = {
  async show(req, res) {
    try {
      const { number } = req.params;

      const data = {};

      // Verify if entered line is from bank or dealership
      if (number.length === 47) {
        // Validating the digits of the digitable line
        if (bankBilletServices.validateDigitableLineDVs(number)) {
          data.barCode = bankBilletServices.generateBarCode(number);

          if (data.barCode.length !== 44)
            return res.json({
              error: 'Erro ao gerar o código de barras',
            });

          if (!bankBilletServices.validadeBarCodeDV(data.barCode))
            return res.json({
              error: 'O Dígito Verificador do código de barras é incorreto',
            });

          data.expirationDate = bankBilletServices.getBankBilletExpirationDate(
            data.barCode
          );
          data.amount = bankBilletServices.getBankBilletAmount(data.barCode);
        } else {
          return res.json({ error: 'Linha digitável informada é inválida' });
        }
      } else if (number.length === 48 && number[0] === 8) {
        if (dealershipPaymentServices.validateDigitableLineDVs(number)) {
          data.barCode = dealershipPaymentServices.generateBarCode(number);

          if (
            !dealershipPaymentServices.validateBarcodeDV(data.barCode, number)
          )
            return res.json({
              error: 'Dígito verificador do código de barras incorreto',
            });

          data.expirationDate = dealershipPaymentServices.getBilletExpirationDate(
            data.barCode
          );
          data.amount = dealershipPaymentServices.getBilletAmount(data.barCode);
        } else {
          return res.json({ error: 'Linha digitável informada é inválida' });
        }
      } else {
        return res.json({ error: 'Linha digitável com tamanho incorreto' });
      }

      return res.json(data);
    } catch (error) {
      return res.json({ error: 'Algo deu errado' });
    }
  },
};
