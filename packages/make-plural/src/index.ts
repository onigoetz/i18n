/**
 * make-plural -- https://github.com/eemeli/make-plural
 * https://github.com/eemeli/make-plural/blob/v4.3.0/src/make-plural.js
 * Copyright (c) 2014-2016 by Eemeli Aro <eemeli@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * The software is provided "as is" and the author disclaims all warranties
 * with regard to this software including all implied warranties of
 * merchantability and fitness. In no event shall the author be liable for
 * any special, direct, indirect, or consequential damages or any damages
 * whatsoever resulting from loss of use, data or profits, whether in an
 * action of contract, negligence or other tortious action, arising out of
 * or in connection with the use or performance of this software.
 */

// The syntax is based on http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules

type Context = { [key: string]: number };

export type Rules = { [key: string]: string };

// eslint-disable-next-line @swissquote/swissquote/sonarjs/cognitive-complexity
function parse(cond: string, context: Context): string {
  if (cond === "i = 0 or n = 1") {
    return "n >= 0 && n <= 1";
  }
  if (cond === "i = 0,1") {
    return "n >= 0 && n < 2";
  }
  if (cond === "i = 1 and v = 0") {
    context.v0 = 1;
    return "n == 1 && v0";
  }
  return cond
    .replace(/([tv]) (!?)= 0/g, (m, sym, noteq) => {
      const sn = `${sym}0`;
      context[sn] = 1;
      return noteq ? `!${sn}` : sn;
    })
    .replace(/\b[fintv]\b/g, m => {
      context[m] = 1;
      return m;
    })
    .replace(/([fin]) % (10+)/g, (m, sym, num) => {
      const sn = sym + num;
      context[sn] = 1;
      return sn;
    })
    .replace(/n10+ = 0/g, "t0 && $&")
    .replace(/(\w+ (!?)= )([0-9.]+,[0-9.,]+)/g, (m, se, noteq, x) => {
      if (m === "n = 0,1") {
        return "(n == 0 || n == 1)";
      }
      if (noteq) {
        return se + x.split(",").join(` && ${se}`);
      }
      /* eslint-disable-next-line @swissquote/swissquote/sonarjs/no-nested-template-literals */
      return `(${se}${x.split(",").join(` || ${se}`)})`;
    })
    .replace(/(\w+) (!?)= ([0-9]+)\.\.([0-9]+)/g, (m, sym, noteq, x0, x1) => {
      if (Number(x0) + 1 === Number(x1)) {
        return noteq
          ? `${sym} != ${x0} && ${sym} != ${x1}`
          : `(${sym} == ${x0} || ${sym} == ${x1})`;
      }
      if (noteq) {
        return `(${sym} < ${x0} || ${sym} > ${x1})`;
      }
      if (sym === "n") {
        context.t0 = 1;
        return `(t0 && n >= ${x0} && n <= ${x1})`;
      }
      return `(${sym} >= ${x0} && ${sym} <= ${x1})`;
    })
    .replace(/ and /g, " && ")
    .replace(/ or /g, " || ")
    .replace(/ = /g, " == ");
}

function printVars(context: Context): string {
  const vars = [];
  if (context.i) {
    vars.push("i = s[0]");
  }
  if (context.f || context.v) {
    vars.push("f = s[1] || ''");
  }
  if (context.t) {
    vars.push("t = (s[1] || '').replace(/0+$/, '')");
  }
  if (context.v) {
    vars.push("v = f.length");
  }
  if (context.v0) {
    vars.push("v0 = !s[1]");
  }
  if (context.t0 || context.n10 || context.n100) {
    vars.push("t0 = Number(s[0]) == n");
  }
  for (const k in context) {
    if (/^.10+$/.test(k)) {
      const k0 = k[0] === "n" ? "t0 && s[0]" : k[0];
      vars.push(`${k} = ${k0}.slice(-${k.substr(2).length})`);
    }
  }
  if (!vars.length) {
    return "";
  }
  return `var ${["s = String(n).split('.')"].concat(vars).join(", ")}`;
}

function foldVars(str: string): string {
  return `  ${str};`.replace(/(.{1,78})(,|$) ?/g, "$1$2\n      ");
}

function foldCond(str: string): string {
  return `  ${str};`.replace(/(.{1,78}) (\|\| |$) ?/gm, "$1\n          $2");
}

function compile(context: Context, rules: Rules): string {
  const cases = [];
  for (const r in rules) {
    if (rules.hasOwnProperty(r)) {
      const cond = rules[r].trim().split(/\s*@\w*/)[0];
      const cat = r.replace("pluralRule-count-", "");
      if (cond) {
        cases.push([parse(cond, context), cat]);
      }
    }
  }

  if (cases.length === 1) {
    return `(${cases[0][0]}) ? '${cases[0][1]}' : 'other'`;
  }

  return cases
    .map(c => `(${c[0]}) ? '${c[1]}'`)
    .concat(["'other'"])
    .join("\n   : ");
}

export default function makePlural(
  rules: Rules
): (value: number) => "zero" | "one" | "two" | "few" | "many" | "other" {
  if (!rules) {
    return () => "other";
  }

  const context = {};
  const compiled = compile(context, rules);

  const body = [foldVars(printVars(context)), foldCond(`return ${compiled}`)]
    .filter(line => !/^[\s;]*$/.test(line))
    .map(line => line.replace(/\s+$/gm, ""))
    .join("\n");

  // eslint-disable-next-line no-new-func
  return new Function("n", body) as (
    value: number
  ) => "zero" | "one" | "two" | "few" | "many" | "other";
}
