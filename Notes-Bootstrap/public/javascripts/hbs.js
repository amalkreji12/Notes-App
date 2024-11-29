const hbs = require('express-handlebars');

const helpers = {
  eq: (a, b) => a === b,
  lt: (a, b) => a < b,
  gt: (a, b) => a > b,
  subtract: (a, b) => a - b,
  add: (a, b) => a + b,
  range: (start, end) => {
    const rangeArray = [];
    for (let i = start; i <= end; i++) {
      rangeArray.push(i);
    }
    return rangeArray;
  },
};

const hbsInstance = hbs.create({ helpers });
