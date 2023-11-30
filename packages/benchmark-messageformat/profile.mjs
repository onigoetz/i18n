import run from "./src/onigoetz-messageformat-initial-make.mjs";

const message = `Yo, {firstName} {lastName} has {numBooks} {numBooks, plural, one {book} other {books}}.`;
const options = {
  firstName: "John",
  lastName: "Constantine",
  numBooks: 5
};

console.log(run(message, options));

//const set = []
//for (let i = 0; i < 10000; i++) {
//  set.push(run.default(message, options));
//}

//console.log("Done", set.length);