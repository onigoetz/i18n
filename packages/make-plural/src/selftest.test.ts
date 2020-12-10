import * as plurals from "test-cldr-data/supplemental_plurals.json";
import * as ordinals from "test-cldr-data/supplemental_ordinals.json";
import makePlural from "./index";

const combined = {
  supplemental: {
    "plurals-type-cardinal": plurals.supplemental["plurals-type-cardinal"],
    "plurals-type-ordinal": ordinals.supplemental["plurals-type-ordinal"]
  }
};

function getTestValues(rules: {
  [key: string]: string;
}): [string, string, string[]][] {
  const tests: [string, string, string[]][] = [];

  for (const r of Object.keys(rules)) {
    const [cond, ...examples] = rules[r].trim().split(/\s*@\w*/);
    const cat = r.replace("pluralRule-count-", "");

    tests.push([
      cat,
      cond,
      examples
        .join(" ")
        .replace(/^[ ,]+|[ ,…]+$/g, "")
        .replace(/(0\.[0-9])~(1\.[1-9])/g, "$1 1.0 $2")
        .split(/[ ,~…]+/)
    ]);
  }

  return tests;
}

function testPluralData(type: "cardinal" | "ordinal", locale: string) {
  const key:
    | "plurals-type-cardinal"
    | "plurals-type-ordinal" = `plurals-type-${type}` as any;
  const rules: { [key: string]: string } =
    combined.supplemental[key][locale as "en"];
  const fn = makePlural(rules);

  const testValues = getTestValues(rules);

  for (const [category, condition, values] of testValues) {
    // eslint-disable-next-line no-loop-func
    describe(`${condition} = ${category}`, () => {
      for (const value of values) {
        // eslint-disable-next-line no-loop-func
        it(value, () => {
          expect(fn((value as unknown) as number)).toEqual(category);
          if (!/\.0+$/.test(value)) {
            expect(fn(Number(value))).toEqual(category);
          }
        });
      }
    });
  }
}

describe("Cardinal rules", () => {
  for (const locale of Object.keys(
    combined.supplemental["plurals-type-cardinal"]
  )) {
    describe(locale, () => testPluralData("cardinal", locale));
  }
});

describe("Ordinal rules", () => {
  for (const locale of Object.keys(
    combined.supplemental["plurals-type-ordinal"]
  )) {
    describe(locale, () => testPluralData("ordinal", locale));
  }
});
