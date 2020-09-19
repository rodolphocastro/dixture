import {
  GeneratorParameters,
  defaultParameters,
  validateGeneratorParameters,
} from "./_parameters.ts";
import { assignField } from "./_simpleGenerator.ts";

/**
 * Describes an object that can be created without parameters.
 */
interface Constructable<T> {
  new (): T;
}

/**
 * Creates a new object of a class with random data.
 * @param ctor a class that can be constructed without parameters
 * @param params random generation parameters
 */
export function create<T>(
  ctor: Constructable<T>,
  params: GeneratorParameters = defaultParameters,
): T {
  if (!validateGeneratorParameters(params)) {
    throw new Error(`The parameters ${params} aren't valid`);
  }
  const result = new ctor();
  const fields = Object.keys(result);
  fields.forEach((f) => {
    try {
      assignField(result, f as keyof T, params);
    } catch {
      // Continue regardless of the error.
      // It's probably an unsupported primitive.
    }
  });
  return result;
}
