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
 * Describes the common logic for a Rule Set.
 */
abstract class BaseRuleSet<T> {
  /**
   * Rules for each field of the class.
   */
  protected readonly rules: RuleFor<T, keyof T>[];

  /**
   * Creates a dummy for constructing a subject.
   */
  protected abstract createDummy(): T;

  /**
   * Creates a new Rule Set.
   */
  protected constructor(
    public readonly name: string,
    ...args: RuleFor<T, keyof T>[]
  ) {
    this.rules = args;
  }

  /**
   * Builds a new instance of the class using the defined rules.
   */
  public build(): T {
    const result = this.createDummy();
    this.rules.forEach((r) => {
      const { field, resolve } = r;
      result[field] = resolve();
    });
    return result;
  }
}

/**
 * Describes a rule set (a blueprint) for creating a class.
 */
export class RuleSet<T> extends BaseRuleSet<T> {
  protected createDummy(): T {
    return new this.ctor();
  }

  constructor(
    protected readonly ctor: Constructable<T>,
    ...args: RuleFor<T, keyof T>[]
  ) {
    super(ctor.name, ...args);
  }
}

/**
 * Describes a rule set (a blueprint) for creating an Interface.
 */
export class InterfaceRuleSet<T> extends BaseRuleSet<T> {
  protected createDummy(): T {
    return {} as T;
  }

  constructor(name: string, ...args: RuleFor<T, keyof T>[]) {
    super(name, ...args);
  }
}

/**
 * A factory for instances of a class/interface.
 */
export class DixtureFactory {
  /**
   * Rule Sets for the Factory.
   */
  protected readonly ruleSets: BaseRuleSet<any>[] = [];

  constructor(...args: BaseRuleSet<any>[]) {
    this.ruleSets = args;
  }

  /**
   * Adds a new Rule Set into the existing collection.
   * @param ruleSet rule set (blueprint) to be added
   */
  addRuleSet<T>(ruleSet: BaseRuleSet<T>) {
    this.ruleSets.push(ruleSet);
  }

  /**
   * Creates a new instance of a class/interface using the available blueprints.
   * @param ctor class/interface to be created
   */
  build<T>(ctor: Constructable<T> | string): T {
    const rulesetKey = typeof ctor === "function"
      ? this.fetchKeyForClass(ctor)
      : ctor;
    const result = this.ruleSets
      .filter((r) => r.name === rulesetKey)[0]?.build();
    return result as T;
  }

  /**
   * Fetches the ruleset's key from a class.
   * @param ctor constructor of a class
   */
  protected fetchKeyForClass<T>(ctor: Constructable<T>): string {
    return ctor.name;
  }
}
