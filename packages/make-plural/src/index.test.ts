import * as plurals from "test-cldr-data/supplemental_plurals.json";
import makePlural, { Rules } from "./index";

const enCardinal = {
  "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
  "pluralRule-count-other":
    " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"
};

const enOrdinal = {
  "pluralRule-count-one":
    "n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
  "pluralRule-count-two":
    "n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …",
  "pluralRule-count-few":
    "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …",
  "pluralRule-count-other":
    " @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, …"
};

const enOrdinalReduced = {
  "pluralRule-count-one": "n % 10 = 1 and n % 100 != 11",
  "pluralRule-count-two": "n % 10 = 2 and n % 100 != 12",
  "pluralRule-count-few": "n % 10 = 3 and n % 100 != 13"
};

it("Answer with 'other' in case of no data", () => {
  const m = makePlural(undefined as unknown as Rules);

  expect(m(1)).toEqual("other");
  expect(m(21)).toEqual("other");
  expect(m(72)).toEqual("other");
  expect(m(33)).toEqual("other");
  expect(m(8)).toEqual("other");
});

it("EN Cardinal Plurals", () => {
  const m = makePlural(enCardinal);

  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("other");
  expect(m(3)).toEqual("other");
});

it("EN Ordinal Plurals", () => {
  const m = makePlural(enOrdinal);

  expect(m(1)).toEqual("one");
  expect(m(21)).toEqual("one");
  expect(m(72)).toEqual("two");
  expect(m(33)).toEqual("few");
  expect(m(8)).toEqual("other");
});

it("EN Ordinal Plurals, Reduced CLDR data", () => {
  const m = makePlural(enOrdinalReduced);

  expect(m(1)).toEqual("one");
  expect(m(21)).toEqual("one");
  expect(m(72)).toEqual("two");
  expect(m(33)).toEqual("few");
  expect(m(8)).toEqual("other");
});

it("AR Cardinal Plurals", () => {
  const m = makePlural(plurals.supplemental["plurals-type-cardinal"].ar);

  expect(m(0)).toEqual("zero");
  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("two");
  expect(m(4)).toEqual("few");
  expect(m(80)).toEqual("many");
  expect(m(104)).toEqual("few");
  expect(m(111)).toEqual("many");
  expect(m(1.1)).toEqual("other");
  expect(m(100)).toEqual("other");
});

it("SHI Cardinal Plurals", () => {
  const m = makePlural(plurals.supplemental["plurals-type-cardinal"].shi);

  expect(m(0)).toEqual("one");
  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("few");
  expect(m(4)).toEqual("few");
  expect(m(80)).toEqual("other");
  expect(m(104)).toEqual("other");
  expect(m(111)).toEqual("other");
  expect(m(1.1)).toEqual("other");
  expect(m(100)).toEqual("other");
});

it("FR Cardinal Plurals", () => {
  const m = makePlural(plurals.supplemental["plurals-type-cardinal"].fr);

  expect(m(0)).toEqual("one");
  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("other");
  expect(m(4)).toEqual("other");
  expect(m(80)).toEqual("other");
  expect(m(104)).toEqual("other");
  expect(m(111)).toEqual("other");
  expect(m(1.1)).toEqual("one");
  expect(m(100)).toEqual("other");
});

it("IS Cardinal Plurals", () => {
  const m = makePlural(plurals.supplemental["plurals-type-cardinal"].is);

  expect(m(0)).toEqual("other");
  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("other");
  expect(m(4)).toEqual("other");
  expect(m(80)).toEqual("other");
  expect(m(104)).toEqual("other");
  expect(m(111)).toEqual("other");
  expect(m(1.1)).toEqual("one");
  expect(m(100)).toEqual("other");
});

it("FIL Cardinal Plurals", () => {
  const m = makePlural(plurals.supplemental["plurals-type-cardinal"].fil);

  expect(m(0)).toEqual("one");
  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("one");
  expect(m(4)).toEqual("other");
  expect(m(5)).toEqual("one");
  expect(m(80)).toEqual("one");
  expect(m(104)).toEqual("other");
  expect(m(111)).toEqual("one");
  expect(m(1.1)).toEqual("one");
  expect(m(100)).toEqual("one");
});

it("SI Cardinal Plurals", () => {
  const m = makePlural(plurals.supplemental["plurals-type-cardinal"].si);

  expect(m(0)).toEqual("one");
  expect(m(1)).toEqual("one");
  expect(m(2)).toEqual("other");
  expect(m(4)).toEqual("other");
  expect(m(80)).toEqual("other");
  expect(m(104)).toEqual("other");
  expect(m(111)).toEqual("other");
  expect(m(1.1)).toEqual("other");
  expect(m(100)).toEqual("other");
});
