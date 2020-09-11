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
  const typeOfField = typeof subject[field];
  switch (typeOfField) {
    case "string":
      return createString(field.toString(), params);
    case "boolean":
      return createBoolean();
    case "number":
      return createNumber(false, params);
    case "bigint":
      return createBigInt(params);
    default:
      throw new Error(`${typeOfField} is not supported`);
  }
}

/**
 * Creates a random string.
 * @param prefix a prefix be used for string generation
 * @param params parameters for random number generation
 */
export function createString(
  prefix: string = "",
  params: GeneratorParameters = defaultParameters,
): string {
  if (!validateGeneratorParameters(params)) {
    throw new Error(`The parameters ${params} aren't valid`);
  }

  const suffix = generateRandomNumber(params).toString();
  return prefix !== "" ? prefix + suffix : suffix;
}

/**
 * Creates a random number.
 * @param roundToInt flag to round the generated number to int
 * @param params parameters for random number generation
 */
export function createNumber(
  roundToInt: boolean = false,
  params: GeneratorParameters = defaultParameters,
): number {
  if (!validateGeneratorParameters(params)) {
    throw new Error(`The parameters ${params} aren't valid`);
  }

  const generatedNumber = generateRandomNumber(params);
  return roundToInt ? Math.round(generatedNumber) : generatedNumber;
}

/**
 * Creates a random boolean.
 * @param diceWeight desired change for a false
 */
export function createBoolean(
  diceWeight: number = .5,
): boolean {
  return Math.random() >= diceWeight;
}

/**
 * Creates a random bigint.
 * @param params parameters for random number generation.
 */
export function createBigInt(
  params: GeneratorParameters = defaultParameters,
): bigint {
  return BigInt(createNumber(true, params));
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
