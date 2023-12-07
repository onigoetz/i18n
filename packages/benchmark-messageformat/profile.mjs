import run from "./dist/onigoetz-messageformat-flat-make.js";

console.log("Before");

const message = `Yo, {firstName} {lastName} has {numBooks} {numBooks, plural, one {book} other {books}}.`;
const options = {
  firstName: "John",
  lastName: "Constantine",
  numBooks: 5
};

const result = run.default(message, options);

console.log(result);

//const set = []
//for (let i = 0; i < 10000; i++) {
//  set.push(run.default(message, options));
//}

//console.log("Done", set.length);
