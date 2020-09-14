// I think you can guess, by this file name, what this is about? 🤣

import { Rhum, assert, fail, assertThrows } from "./deps.ts";

interface JustAnotherSubject {
  name: string;
  goodThru: Date;
}

// Yeah, this is copy and paste. Sorry folks

// TODO: Move RuleFor<T, K> into a shared .ts so both interfaces and class can leverage it
/**
 * Describes a rule for a field of an interface.
 */
interface RuleFor<T, K extends keyof T> {
  field: K;
  resolve: (...args: any[]) => T[K];
}

/**
 * Describes a blueprint for creating an interface, hopefully.
 */
export class InterfaceBlueprint<T> {
  /**
   * Name of the interface created by this blueprint.
   */
  public readonly name: string;

  /**
   * Rules for each field of the class.
   */
  protected readonly rules: RuleFor<T, keyof T>[];

  // TODO: I'm not fond of passing the interface name as a "open" string. I'll try to get rid of this :)
  // However I'll still need the name if I wish to plug this into the Dixture factory... I'll need to get some more
  // prototypes for this before publishing a public api :/
  constructor(
    protected readonly interfaceName: string,
    ...args: RuleFor<T, keyof T>[]
  ) {
    this.name = interfaceName;
    this.rules = args;
  }

  /**
   * Builds a new instance of the interface using the defined rules.
   */
  build(): T {
    const result = {} as T;
    this.rules.forEach(({ field, resolve }) => {
      result[field] = resolve();
    });
    return result;
  }
}

Rhum.testPlan(
  "Playground",
  () => {
    Rhum.testSuite(
      "1. Interface Blueprints",
      () => {
        Rhum.testCase(
          "1. Should create an Interface after all rules are set",
          () => {
            const subjectKey = "JustAnotherSubject";
            const mySubject = new InterfaceBlueprint<JustAnotherSubject>(
              subjectKey,
              {
                field: "goodThru",
                resolve: () => new Date(),
              },
              {
                field: "name",
                resolve: () => "Just Another Brick in the Wall",
              },
            );
            const result = mySubject.build();
            assert(result != null);
            assert(result.goodThru != null);
            assert(result.name === "Just Another Brick in the Wall");
          },
        );
      },
    );
  },
);

Rhum.run();
