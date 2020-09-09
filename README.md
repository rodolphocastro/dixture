# Dixture

Dixture helps you create random data for your tests.

## 🚥 Current Status

**Master status** ![Build and Test](https://github.com/rodolphocastro/dixture/workflows/Build%20and%20Test/badge.svg?branch=master)

**Project status**: *Under development*

**Latest stable version**: *There are no public releases yet*

## 🏆 Acknowledgements

Dixture is based on the great [AutoFixture](https://github.com/AutoFixture/AutoFixture) library that exists on the `.NET` environment.

I've used this library for so long for my Unit and Integration tests that I needed to, somehow, get some of its functionality when working on my `Deno`'s tests.

Thus I began working on this project.

## ⚡ Getting Started

> W.I.P.

## 🛣 Roadmap

### 🚩 v0.1.0

+ [X] Create random values for primitive types (*aka numbers, strings and booleans*)
+ [X] Create and assign random values for primitive types (*ditto for the aka above*)
+ [X] Validate generation parameters

### 🏁 v0.2.0

+ [ ] Create and assign random values for all primitive fields of an object (*aka numbers, strings and booleans*)
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

> W.I.P.

### 🤖 Testing

We use `Rhum` for our tests so you'll need to run `deno tests --allow-env` to run all the tests.
