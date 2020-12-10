"use strict";

const run = require("./dist/js/onigoetz-messageformat-memoized.min.js");

const message = `Yo, {firstName} {lastName} has {numBooks, number, integer} {numBooks, plural, one {book} other {books}}.`;
const options = {
  firstName: "John",
  lastName: "Constantine",
  numBooks: 5
};

console.log(run(message, options));

for (let i = 0;  i < 10000; i++) {
    run(message, options);
}
