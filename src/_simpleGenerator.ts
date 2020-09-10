import {
  GeneratorParameters,
  defaultParameters,
  validateGeneratorParameters,
} from "./_parameters.ts";

function generateRandomNumber(
  { max, min }: GeneratorParameters = defaultParameters,
): number {
  return (Math.random() * max) + min;
}

/**
 * Creates a random value for a string, boolean, number or bigint field.
 * @param subject object that owns the field
 * @param field the field itself
 * @param params parameters for random number generation
 */
export function createFieldValue<T>(
  subject: T,
  field: keyof T,
  params: GeneratorParameters = defaultParameters,
): string | boolean | number | bigint {
  if (!validateGeneratorParameters(params)) {
    throw new Error(`The parameters ${params} aren't valid`);
  }
  const suffix = generateRandomNumber(params);
  const typeOfField = typeof subject[field];
  switch (typeOfField) {
    case "string":
      return `${field}-${suffix}`;
    case "boolean":
      return Math.random() >= .5;
    case "number":
      return suffix;
    case "bigint":
      return BigInt(Math.floor(suffix));
    default:
      throw new Error(`${typeOfField} is not supported`);
  }
}

/**
 * Creates and assign a value for a string, boolean, number or bigint field.
 * @param subject object that owns the field
 * @param field the field itself
 * @param params parameters for random number generation
 */
export function assignField<T>(
  subject: T,
  field: keyof T,
  params: GeneratorParameters = defaultParameters,
) {
  const fieldValue = createFieldValue(subject, field, params);
  (subject[field] as any) = fieldValue;
}
