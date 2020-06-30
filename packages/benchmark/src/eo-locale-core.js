import { Translator } from "@eo-locale/core";

const translator = new Translator("en");

export default (string, options) =>
  translator.translate(`name_${string.length}`, {
    defaultMessage: string,
    ...options
  });
