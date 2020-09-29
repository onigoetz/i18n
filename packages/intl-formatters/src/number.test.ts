import { currencyFormatter, numberFormatter } from "./number";
import { CurrencyFormatterOptions } from "@onigoetz/i18n-types";

it("Formats currencies", () => {
  const code: CurrencyFormatterOptions = { style: "code" };
  const name: CurrencyFormatterOptions = { style: "name" };
  const teslaS = 69900;

  // \xa0 = &nbsp;
  expect(currencyFormatter("en", "CLF")(12345)).toEqual("CLF\xa012,345.0000");
  expect(currencyFormatter("en", "CLF")(12345.67)).toEqual(
    "CLF\xa012,345.6700"
  );
  expect(currencyFormatter("en", "ZWD")(12345)).toEqual("ZWD\xa012,345");
  expect(currencyFormatter("en", "ZWD")(12345.67)).toEqual("ZWD\xa012,346");
  expect(currencyFormatter("en", "JPY")(12345.67)).toEqual("¥12,346");

  expect(currencyFormatter("en", "CLF", code)(12345.67)).toEqual(
    "CLF\xa012,345.6700"
  );

  expect(currencyFormatter("en", "CLF", name)(12345.67)).toEqual(
    "12,345.6700 Chilean units of account (UF)"
  );

  expect(currencyFormatter("en", "USD")(teslaS)).toEqual("$69,900.00");
  expect(currencyFormatter("de", "USD")(teslaS)).toEqual("69.900,00\xa0$");
  expect(currencyFormatter("zh", "USD")(teslaS)).toEqual("US$69,900.00");

  expect(currencyFormatter("en", "USD")(-teslaS)).toEqual("-$69,900.00");
  expect(currencyFormatter("de", "USD")(-teslaS)).toEqual("-69.900,00\xa0$");
  expect(currencyFormatter("zh", "USD")(-teslaS)).toEqual("-US$69,900.00");

  /*expect(
    currencyFormatter("en", "HKD", { symbolForm: "narrow" })(teslaS)
  ).toEqual("$69,900.00");*/

  expect(currencyFormatter("en", "USD", code)(teslaS)).toEqual(
    "USD\xa069,900.00"
  );
  expect(currencyFormatter("de", "USD", code)(teslaS)).toEqual(
    "69.900,00\xa0USD"
  );
  expect(currencyFormatter("zh", "USD", code)(teslaS)).toEqual(
    "USD\xa069,900.00"
  );

  expect(currencyFormatter("en", "USD", name)(teslaS)).toEqual(
    "69,900.00 US dollars"
  );
  expect(currencyFormatter("de", "USD", name)(teslaS)).toEqual(
    "69.900,00 US-Dollar"
  );
  expect(currencyFormatter("zh", "USD", name)(teslaS)).toEqual("69,900.00美元");

  /*expect(currencyFormatter("en", "USD", { style: "accounting" })(-1)).toEqual(
    "($1.00)"
  );*/
});

it("Formats number", () => {
  var pi = 3.14159265359;
  expect(numberFormatter("en")(pi)).toEqual("3.142");
  expect(numberFormatter("es")(pi)).toEqual("3,142");
  //expect(numberFormatter("ar")(pi)).toEqual( "٣٫١٤٢");
  //expect(numberFormatter("zh-u-nu-native")(pi)).toEqual( "三.一四二");
  expect(numberFormatter("en")(99999999.99)).toEqual("99,999,999.99");
  expect(numberFormatter("en")(NaN)).toEqual("0");
  expect(numberFormatter("en", { round: "round" })(NaN)).toEqual("0");

  expect(
    numberFormatter("en", {
      minimumIntegerDigits: 2,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })(pi)
  ).toEqual("03.14");

  expect(
    numberFormatter("en", {
      maximumFractionDigits: 0
    })(pi)
  ).toEqual("3");

  expect(
    numberFormatter("en", {
      minimumFractionDigits: 3
    })(1.1)
  ).toEqual("1.100");

  expect(
    numberFormatter("en", {
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 3
    })(pi)
  ).toEqual("3.14");

  expect(
    numberFormatter("en", {
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 3
    })(12345)
  ).toEqual("12,300");

  expect(
    numberFormatter("en", {
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 3
    })(0.00012345)
  ).toEqual("0.000123");

  expect(
    numberFormatter("en", {
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 3
    })(0.00010001)
  ).toEqual("0.0001");

  expect(numberFormatter("en", { useGrouping: false })(99999999.99)).toEqual(
    "99999999.99"
  );

  expect(numberFormatter("en", { round: "truncate" })(99999999.99)).toEqual(
    "99,999,999"
  );
  expect(numberFormatter("en", { round: "truncate" })(-99999999.99)).toEqual(
    "-99,999,999"
  );

  /*expect(
    numberFormatter("en", {
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 3,
    })(0)
  ).toEqual("0.0");*/
});
