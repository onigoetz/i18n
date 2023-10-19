import Parser from "@ffz/icu-msgparser";
import makePlural from "@onigoetz/make-plural";

class Renderer {
  constructor(locale, plural) {
    this.locale = locale;
    this.pluralGenerator = plural;
  }

  getPluralRules(type) {
    return this.pluralGenerator(this.locale, type);
  }

  renderPlural(token, variables) {
    const value = variables[token.v];
    const pluralType = token.t === "selectordinal" ? "ordinal" : "cardinal";
    const offset = token.f || 0;
    const children = token.o;
    const pluralRules = this.getPluralRules(pluralType);

    return this.render(
      children[`=${value}`] ||
        children[pluralRules(value - offset)] ||
        children.other,
      variables,
    );
  }

  renderNumber(token, variables) {
    // TODO :: use options
    const formatter = new Intl.NumberFormat(this.locale);
    return formatter.format(variables[token.v]);
  }

  // TODO
  //ordinal: interpretNumber, // TODO: support rbnf
  //spellout: interpretNumber, // TODO: support rbnf
  //duration: interpretDuration,
  //date: interpretDateTime,
  //time: interpretDateTime,

  renderSelect(token, variables) {
    const value = variables[token.v];

    return this.render(token.o[value] || token.o.other, variables);
  }

  renderSelectOrdinal(token, variables) {
    return this.renderPlural(token, variables);
  }

  render(parsedString, variables) {
    let final = "";

    for (const token of parsedString) {
      if (typeof token === "string") {
        final += token;
        continue;
      }

      if (token.t) {
        switch (token.t) {
          case "plural":
            final += this.renderPlural(token, variables);
            break;
          case "number":
            final += this.renderNumber(token, variables);
            break;
          case "select":
            final += this.renderSelect(token, variables);
            break;
          case "selectordinal":
            final += this.renderSelectOrdinal(token, variables);
            break;
          default:
            // eslint-disable-next-line no-console
            console.error("Don't know what this is: ", token);
        }
        continue;
      }

      if (token.v) {
        if (token.f) {
          final += variables[token.v] - token.f;
        } else {
          final += variables[token.v];
        }

        continue;
      }

      // eslint-disable-next-line no-console
      console.error("Don't know what this is: ", token);
    }

    return final;
  }
}

const pluralRules = {
  "plurals-type-cardinal": {
    en: {
      "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
      "pluralRule-count-other":
        " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …",
    },
  },
  "plurals-type-ordinal": {
    en: {
      "pluralRule-count-one":
        "n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
      "pluralRule-count-two":
        "n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …",
      "pluralRule-count-few":
        "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …",
      "pluralRule-count-other":
        " @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, …",
    },
  },
};

const pluralMemory = {};

function pluralGenerator(locale, type) {
  const key = `${locale}-${type}`;

  if (!pluralMemory.hasOwnProperty(key)) {
    pluralMemory[key] = makePlural(pluralRules[`plurals-type-${type}`][locale]);
  }

  return pluralMemory[key];
}

const parser = new Parser();
const renderer = new Renderer("en", pluralGenerator);

export default (string, options) => {
  return renderer.render(parser.parse(string), options);
};
