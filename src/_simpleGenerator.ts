interface GeneratorParameters {
  max: number;
  min: number;
}

const defaultParameters: GeneratorParameters = {
  min: 1,
  max: 1000,
};

function generateRandomNumber(
  { max, min }: GeneratorParameters = defaultParameters,
): number {
  return (Math.random() * max) + min;
}

export function createFieldValue<T>(
  subject: T,
  field: keyof T,
  params: GeneratorParameters = defaultParameters,
): string | boolean | number {
  const suffix = generateRandomNumber(params);
  const typeOfField = typeof subject[field];
  switch (typeOfField) {
    case "string":
      return `${field}-${suffix}`;
    case "boolean":
      return Math.random() >= .5;
    case "number":
      return suffix;
    default:
      throw new Error(`${typeOfField} is not supported`);
  }
}
