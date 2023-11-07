import { Translator } from '@eo-locale/core';

export default (string, options) => {
  const locales = [
    {
      language: 'en',
      messages: {
        hello: string
      }
    }
  ];

  const englishTranslator = new Translator('en', locales);
  return englishTranslator.translate('hello', options);
};
