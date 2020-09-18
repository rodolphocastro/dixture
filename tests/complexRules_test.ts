import { Rhum, assert } from "./deps.ts";
import {
  DixtureFactory,
  dixtureFns,
  InterfaceRuleSet,
  RuleSet,
} from "../src/_factory.ts";

interface DateRange {
  beginsOn: Date;
  endsOn: Date;
}

const refDate = new Date();

class FilterUsersCommand {
  username: string = "";
  range: DateRange = {
    beginsOn: refDate,
    endsOn: refDate,
  };

  getUsername() {
    return this.username;
  }
}

class AnotherCommand {
  userCmd: FilterUsersCommand | null = null;
  range?: DateRange;

  getMagicValue(): string {
    return "42";
  }
}

Rhum.testPlan(
  "Complex Rules",
  () => {
    const dateRangeKey = "IDateRange";
    Rhum.testSuite(
      "1. Nested Objects",
      () => {
        let subject: DixtureFactory;

        Rhum.beforeAll(() => {
          subject = new DixtureFactory();
        });

        Rhum.testCase(
          "1. Should allow for a class to resolve an interface",
          () => {
            let interfaceResolved = 0;
            subject.addRuleSet<DateRange>(
              new InterfaceRuleSet(dateRangeKey, {
                field: "beginsOn",
                resolve: () => {
                  ++interfaceResolved;
                  return dixtureFns.PastDate();
                },
              }, {
                field: "endsOn",
                resolve: () => {
                  ++interfaceResolved;
                  return dixtureFns.FutureDate();
                },
              }),
            );

            subject.addRuleSet(
              new RuleSet(FilterUsersCommand, {
                field: "username",
                resolve: () =>
                  dixtureFns.NamedString<FilterUsersCommand>("username"),
              }, {
                field: "range",
                resolve: () => subject.build<DateRange>(dateRangeKey),
              }),
            );

            const result = subject.build(
              FilterUsersCommand,
            );
            assert(result.username != null);
            assert(result.username != "");
            assert(result.range.beginsOn !== refDate);
            assert(result.range.endsOn !== refDate);
            assert(interfaceResolved === 2);
          },
        );

        Rhum.testCase(
          "2. Should allow for a class to resolve an interface even when inverted",
          () => {
            let interfaceResolved = 0;

            subject.addRuleSet(
              new RuleSet(FilterUsersCommand, {
                field: "username",
                resolve: () =>
                  dixtureFns.NamedString<FilterUsersCommand>("username"),
              }, {
                field: "range",
                resolve: () => subject.build<DateRange>(dateRangeKey),
              }),
            );

            subject.addRuleSet<DateRange>(
              new InterfaceRuleSet(dateRangeKey, {
                field: "beginsOn",
                resolve: () => {
                  ++interfaceResolved;
                  return dixtureFns.PastDate();
                },
              }, {
                field: "endsOn",
                resolve: () => {
                  ++interfaceResolved;
                  return dixtureFns.FutureDate();
                },
              }),
            );

            const result = subject.build(
              FilterUsersCommand,
            );
            assert(result.username != null);
            assert(result.username != "");
            assert(result.range.beginsOn !== refDate);
            assert(result.range.endsOn !== refDate);
            assert(interfaceResolved === 2);
          },
        );

        Rhum.testCase(
          "3. Should allow nested resolution",
          () => {
            let interfaceResolved = 0;
            subject.addRuleSet<DateRange>(
              new InterfaceRuleSet(dateRangeKey, {
                field: "beginsOn",
                resolve: () => {
                  ++interfaceResolved;
                  return dixtureFns.PastDate();
                },
              }, {
                field: "endsOn",
                resolve: () => {
                  ++interfaceResolved;
                  return dixtureFns.FutureDate();
                },
              }),
            );

            subject.addRuleSet(
              new RuleSet(FilterUsersCommand, {
                field: "username",
                resolve: () =>
                  dixtureFns.NamedString<FilterUsersCommand>("username"),
              }, {
                field: "range",
                resolve: () => subject.build<DateRange>(dateRangeKey),
              }),
            );

            subject.addRuleSet(
              new RuleSet(AnotherCommand, {
                field: "range",
                resolve: () => subject.build<DateRange>(dateRangeKey),
              }, {
                field: "userCmd",
                resolve: () => subject.build(FilterUsersCommand),
              }),
            );

            const result = subject.build(
              AnotherCommand,
            );
            assert(result.range != null);
            assert(result.userCmd != null);
            assert(result.range.beginsOn !== refDate);
            assert(result.range.endsOn !== refDate);
            assert(interfaceResolved === 4);
          },
        );
      },
    );
  },
);

Rhum.run();
