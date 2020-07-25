export function hasOwnProperty(object: object, property: string) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

export function alwaysArray(stringOrArray: string | string[]): string[] {
  if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  }

  return stringOrArray ? [stringOrArray] : [];
}

export function objectExtend(destination, ...sources);
export function objectExtend(destination) {
  // eslint-disable-next-line prefer-rest-params
  const sources = [].slice.call(arguments, 1);

  sources.forEach(source => {
    for (const prop in source) {
      if (hasOwnProperty(source, prop)) {
        destination[prop] = source[prop];
      }
    }
  });

  return destination;
}
