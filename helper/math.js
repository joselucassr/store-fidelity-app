const runOp = (val1, op, val2) => {
  switch (op) {
    case '+':
      return val1 + val2;
    case '-':
      return val1 - val2;
  }
};

module.exports = {
  runOp,
};
