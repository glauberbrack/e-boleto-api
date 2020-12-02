/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');

describe('Bank Billet', () => {
  it('It shoudl be able to return the bank billet data', async () => {
    const res = await request(app).get(
      '/boleto/34191790010104351004791020150008583900000026000'
    );

    expect(res.body).toHaveProperty('barCode');
    expect(res.body).toEqual({
      barCode: '34195839000000260001790001043510049102015000',
      expirationDate: '26/9/2020',
      amount: 'R$260.00',
    });
  });
});

describe('Dealership Payment', () => {
  it('It should be able to return the dealership payment data', async () => {
    const res = await request(app).get(
      '/boleto/896100000000599800010119053332010064260000157446'
    );

    expect(res.body).toHaveProperty('barCode');
    expect(res.body).toEqual({
      barCode: '89610000000599800010110533320100626000015744',
      expirationDate: 'Sem data de vencimento',
      amount: 'R$59.98',
    });
  });

  it('It should be able to return an error when the digit checked is incorrect', async () => {
    const res = await request(app).get(
      '/boleto/896100000001599800010119053332010064260000157446'
    );

    expect(res.body).toHaveProperty('error');
    expect(res.body).toEqual({
      error: 'Linha digitável informada é inválida',
    });
  });
});
