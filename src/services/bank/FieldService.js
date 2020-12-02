class FieldServices {
  // Multiply each number by it weight and sum to get field total value
  fieldTotal(fieldNumbers) {
    if (!Array.isArray(fieldNumbers))
      throw new Error('Erro ao calcular campo livre');

    let multiplier = 2;

    const total = fieldNumbers
      .map((number) => {
        let result = Number(number) * multiplier;
        if (result > 9)
          result = Number(result.toString()[0]) + Number(result.toString()[1]);
        multiplier = multiplier === 2 ? 1 : 2;

        return result;
      })
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });

    return total;
  }

  validateDV(fieldTotal, digit) {
    // Subtract field total value by the previous decade

    const fieldDVResult = Math.ceil(fieldTotal / 10) * 10 - fieldTotal;
    return fieldDVResult === digit;
  }
}

module.exports = new FieldServices();
