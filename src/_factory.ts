import {
  createBigInt,
  createBoolean,
  createNumber,
  createString,
} from "./_simpleGenerator.ts";

/**
 * Describe the default functions expected by Dixture to handle primitives.
 */
export interface GenerationFunctions {
  /**
   * Creates a bigint.
   */
  BigInt: (...params: any[]) => bigint;

  /**
   * Creates a boolean.
   */
  Bool: (...params: any[]) => boolean;

  /**
   * Creates a number.
   */
  Number: (...params: any[]) => number;

  /**
   * Creates a string.
   */
  String: (...params: any[]) => string;

  /**
   * Creates a number rounded to a whole point.
   */
  Int: (...params: any[]) => number;
}

/**
 * Default functions for creating primitives with Dixture.
 */
export const dixtureFns: GenerationFunctions = {
  BigInt: createBigInt,
  Bool: createBoolean,
  Number: createNumber,
  String: createString,
  Int: () => createNumber(true),
};

/**
 * Describes a object constructable by a parameterless ctor.
 */
interface Constructable<T> {
  new (): T;
  new (...args: any[]): T;
}

/**
 * Describes a rule for a field of a class.
 */
interface RuleFor<T, K extends keyof T> {
  field: K;
  resolve: (...args: any[]) => T[K];
}

/**
 * Describes a rule set (a blueprint) for creating a class.
 */
export class RuleSet<T> {
  /**
   * Name of the class created by this blueprint.
   */
  public readonly name: string;

  /**
   * Rules for each field of the class.
   */
  protected readonly rules: RuleFor<T, keyof T>[];

  constructor(
    protected readonly ctor: Constructable<T>,
    ...args: RuleFor<T, keyof T>[]
  ) {
    this.name = ctor.name;
    this.rules = args;
  }

  /**
   * Builds a new instance of the class using the defined rules.
   */
  build(): T {
    const result = new this.ctor();
    this.rules.forEach((r) => {
      const { field, resolve } = r;
      result[field] = resolve();
    });
    return result;
  }
}

/**
 * A factory for instances of a class.
 */
export class DixtureFactory {
  /**
   * Rule Sets for the Factory.
   */
  protected readonly ruleSets: RuleSet<any>[] = [];

  constructor(...args: RuleSet<any>[]) {
    this.ruleSets = args;
  }

  /**
   * Adds a new ruleset into the existing ruleset collection.
   * @param ruleSet rule set (blueprint) to be added
   */
  addRuleSet<T>(ruleSet: RuleSet<T>) {
    this.ruleSets.push(ruleSet);
  }

  /**
   * Creates a new instance of a class using the available blueprints.
   * @param ctor class to be created
   */
  build<T>(ctor: Constructable<T>): T {
    const result = this.ruleSets
      .filter((r) => r.name == ctor.name)[0]?.build();
    return result as T;
  }
}
