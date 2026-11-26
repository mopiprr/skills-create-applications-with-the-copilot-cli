// Supported operations: addition (+), subtraction (-), multiplication (* or ×), and division (/ or ÷).
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
};

function calculate(operation, left, right) {
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
  if (args.length !== 3) {
    throw new Error('Usage: node src/calculator.js <operation> <number1> <number2>');
  }

  const [operation, leftInput, rightInput] = args;
  if (leftInput.trim() === '' || rightInput.trim() === '') {
    throw new Error('Both operands must be valid finite numbers.');
  }

  const left = Number(leftInput);
  const right = Number(rightInput);
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

module.exports = { calculate };
