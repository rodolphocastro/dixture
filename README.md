# Dixture

Dixture helps you create random data for your tests, with zero external dependencies!

## 🚥 Current Status

**Master status** ![Build and Test](https://github.com/rodolphocastro/dixture/workflows/Build%20and%20Test/badge.svg?branch=master)

**Project status**: *Under development*

**Latest stable version**: *There are no public releases yet*

## 🏆 Acknowledgements

Dixture is *loosely* based on the great [AutoFixture](https://github.com/AutoFixture/AutoFixture) library that exists on the `.NET` environment.

I've used this library for so long for my Unit and Integration tests that I needed to, somehow, get some of its functionality when working on my `Deno`'s tests.

Thus I began working on this project.

## ⚡ Getting Started

Simply import us by `deno.land/x/` and use your favorite flavor of test data generation!

*As of v0.1.0* you can pick from two functions:

1. The first function looks at a field name and generates a random value for it
2. The second function generates and assigns a random value for a specific field

```typescript
import {
  assignField,
  createFieldValue,
} from "https://deno.land/x/dixture@v0.1.0/mod.ts";

interface Person {
  name: string;
  age: number;
  isAlive: boolean;
}

const subject: Person = {
  age: 1,
  isAlive: false,
  name: "A Person",
};

const result = createFieldValue<Person>(subject, "name");
console.log(result);

assignField(subject, "age", {
  min: 1,
  max: 100,
});
console.log(subject.age);

assignField(subject, "isAlive");
console.log(subject.isAlive);
```

You can check out all our samples at the [samples directory](./samples/)!

## 🛣 Roadmap

### 🚩 v0.1.0

+ [X] Create random values for primitive types (*aka numbers, strings and booleans*)
+ [X] Create and assign random values for primitive types (*ditto for the aka above*)
+ [X] Validate generation parameters

### 🏁 v0.2.0

+ [X] Create and assign random values for all primitive fields of an object (*aka numbers, strings and booleans*)
+ [ ] Create a Factory API (*aka users can ask a single Factory for an object T and they'll have it*)

### 💭 Someday

+ [ ] Allow recursive generation (*aka we can handle nested objects*)
+ [ ] Allow customization of the generation strategy (*aka consumers can tweak how we generate objects*)
+ [ ] Create a Builder/Fluent API (*aka allow consumers to chain customization calls*)

## ➕ Contributing to this Project

Simply follow the standards and ensure all the tests are ✅, then create a pull request! 😄

### 📚 Code Standards

> W.I.P.

### 🔨 Building

Well, you don't *really* need to build this but you could use `deno cache` to cache the dependencies and ensure everything is okay or `deno bundle` to create a single file with all the required dependencies.

### 🤖 Testing

We use `Rhum` for our tests so you'll need to run `deno tests --allow-env` to run all the tests.
