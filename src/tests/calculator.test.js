'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { describe, it } = require('node:test');
const { calculate } = require('../calculator');

const calculatorPath = path.resolve(__dirname, '../calculator.js');

function runCalculator(args) {
  return spawnSync(process.execPath, [calculatorPath, ...args], {
    encoding: 'utf8',
  });
}

describe('calculate()', () => {
  describe('addition', () => {
    it('adds the example values from the image', () => {
      assert.equal(calculate('+', 2, 3), 5);
    });

    it('supports the addition name and decimal operands', () => {
      assert.equal(calculate('add', 1.5, 2.25), 3.75);
    });

    it('supports zero and negative operands', () => {
      assert.equal(calculate('+', -4, 0), -4);
    });
  });

  describe('subtraction', () => {
    it('subtracts the example values from the image', () => {
      assert.equal(calculate('-', 10, 4), 6);
    });

    it('supports the subtraction name and negative results', () => {
      assert.equal(calculate('subtract', 3, 8), -5);
    });
  });

  describe('multiplication', () => {
    it('multiplies the example values from the image', () => {
      assert.equal(calculate('*', 45, 2), 90);
    });

    it('supports the multiply name and the multiplication symbol', () => {
      assert.equal(calculate('multiply', -3, 4), -12);
      assert.equal(calculate('×', 2.5, 4), 10);
    });

    it('returns zero when either operand is zero', () => {
      assert.equal(calculate('*', 12, 0), 0);
      assert.equal(calculate('*', 0, 12), 0);
    });
  });

  describe('division', () => {
    it('divides the example values from the image', () => {
      assert.equal(calculate('/', 20, 5), 4);
    });

    it('supports the divide name, division symbol, and fractional results', () => {
      assert.equal(calculate('divide', 7, 2), 3.5);
      assert.equal(calculate('÷', 20, 5), 4);
    });

    it('throws a clear error for division by zero using every division alias', () => {
      for (const operation of ['/', '÷', 'divide']) {
        assert.throws(
          () => calculate(operation, 8, 0),
          { message: 'Cannot divide by zero.' },
        );
      }
    });
  });

  it('rejects unsupported operations', () => {
    assert.throws(() => calculate('%', 5, 2), /Unsupported operation/);
  });

  it('rejects non-numeric and non-finite operands', () => {
    for (const operand of [NaN, Infinity, -Infinity, '2']) {
      assert.throws(
        () => calculate('+', operand, 1),
        { message: 'Both operands must be valid finite numbers.' },
      );
    }
  });
});

describe('calculator CLI', () => {
  it('prints the result for a valid operation', () => {
    const result = runCalculator(['+', '2', '3']);

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '5\n');
    assert.equal(result.stderr, '');
  });

  it('prints a usage message when the argument count is incorrect', () => {
    const result = runCalculator(['+', '2']);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Usage:/);
  });

  it('reports invalid operands without printing a result', () => {
    const result = runCalculator(['+', 'two', '3']);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /valid finite numbers/);
    assert.equal(result.stdout, '');
  });

  it('reports division by zero with a non-zero exit status', () => {
    const result = runCalculator(['/', '8', '0']);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Cannot divide by zero/);
    assert.equal(result.stdout, '');
  });
});
