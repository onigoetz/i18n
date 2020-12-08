export function hasOwnProperty(object: object, property: string) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

interface IObject {
  [key: string]: any;
}

type TUnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;

/**
 * Shallow Clone
 *
 * @param objects An array of objects
 */
export function objectExtend<T extends IObject[]>(
  ...objects: T
): TUnionToIntersection<T[number]> {
  // eslint-disable-next-line prefer-rest-params
  const destination = arguments[0];
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
