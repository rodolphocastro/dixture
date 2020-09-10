/**
 * Describes parameters for random number generation.
 */
export interface GeneratorParameters {
  max: number;
  min: number;
}

/**
 * Default parameters, in case consumers don't want to tamper with the API.
 */
export const defaultParameters: GeneratorParameters = {
  min: 1,
  max: 1000,
};

/**
 * Returns if a Generator Parameter is valid.
 * @param param0 Parameters that should be validated
 */
export function validateGeneratorParameters(
  { min, max }: GeneratorParameters,
): boolean {
  return min > 0 && min <= max;
}
