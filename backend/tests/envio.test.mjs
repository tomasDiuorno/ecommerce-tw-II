import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validarDestino } from '../src/validators/envioValidator.ts';
import { calcularCostoEnvio, determinarZona } from '../src/services/envioService.ts';

test('acepta códigos numéricos, con provincia y CPA con espacios', () => {
  for (const codigo of ['1754', 'B1754', 'B1754JEC', ' b 1754 jec ']) {
    const destino = validarDestino('Dirección de prueba', codigo);
    const zona = determinarZona(destino.codigoPostal);
    assert.equal(zona, 'sanJusto', codigo);
    assert.equal(calcularCostoEnvio(50000, zona), 1500, codigo);
  }
});

test('conserva la provincia para determinar la tarifa', () => {
  for (const [codigo, zona, costo] of [
    ['X5000', 'restoDelPais', 6000],
    [' x5000 ', 'restoDelPais', 6000],
    ['C1754', 'amba', 3000],
    ['S1754', 'restoDelPais', 6000],
    ['S1754ABC', 'restoDelPais', 6000],
    ['2000', 'restoDelPais', 6000],
  ]) {
    const destino = validarDestino('Dirección de prueba', codigo);
    assert.equal(determinarZona(destino.codigoPostal), zona);
    assert.equal(calcularCostoEnvio(50000, zona), costo);
  }
});

test('rechaza códigos incompletos o con caracteres inválidos', () => {
  for (const codigo of ['', 'ABC', '123', '12345', 'B1754AB', '1754ABC', 'B1754!']) {
    assert.throws(() => validarDestino('Dirección de prueba', codigo), codigo);
  }
});
