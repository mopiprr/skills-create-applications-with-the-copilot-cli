// Supported operations: addition (+), subtraction (-), multiplication (* or ×), division (/ or ÷),
// modulo (%), exponentiation (^ or **), and square root (sqrt or √).
function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Both operands must be valid finite numbers.');
  }
  if (b === 0) {
    throw new Error('Cannot modulo by zero.');
  }

  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new Error('Both operands must be valid finite numbers.');
  }

  const result = base ** exponent;
  if (!Number.isFinite(result)) {
    throw new Error('Exponentiation must produce a finite number.');
  }

  return result;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error('The operand must be a valid finite number.');
  }
  if (n < 0) {
    throw new Error('Cannot take the square root of a negative number.');
  }

  return Math.sqrt(n);
}

const operations = {
  '+': (left, right) => left + right,
  add: (left, right) => left + right,
  '-': (left, right) => left - right,
  subtract: (left, right) => left - right,
  '*': (left, right) => left * right,
  '×': (left, right) => left * right,
  multiply: (left, right) => left * right,
  '/': (left, right) => left / right,
  '÷': (left, right) => left / right,
  divide: (left, right) => left / right,
  '%': modulo,
  modulo,
  '^': power,
  '**': power,
  power,
};

const unaryOperations = {
  sqrt: squareRoot,
  '√': squareRoot,
  squareRoot,
};

function calculate(operation, left, right) {
  const calculateUnaryOperation = unaryOperations[operation];
  if (calculateUnaryOperation) {
    if (right !== undefined) {
      throw new Error('Square root accepts exactly one operand.');
    }
    return calculateUnaryOperation(left);
  }

  const calculateOperation = operations[operation];

  if (!calculateOperation) {
    throw new Error(`Unsupported operation: ${operation}`);
  }
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('Both operands must be valid finite numbers.');
  }
  if ((operation === '/' || operation === '÷' || operation === 'divide') && right === 0) {
    throw new Error('Cannot divide by zero.');
  }

  return calculateOperation(left, right);
}

function main(args) {
  const [operation, leftInput, rightInput] = args;
  const isUnaryOperation = Object.hasOwn(unaryOperations, operation);
  if ((isUnaryOperation && args.length !== 2) || (!isUnaryOperation && args.length !== 3)) {
    throw new Error('Usage: node src/calculator.js <operation> <number> [number2]');
  }
  if (leftInput.trim() === '' || (!isUnaryOperation && rightInput.trim() === '')) {
    throw new Error('Both operands must be valid finite numbers.');
  }

  const left = Number(leftInput);
  const right = isUnaryOperation ? undefined : Number(rightInput);
  console.log(calculate(operation, left, right));
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };
