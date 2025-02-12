/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  // * --------------- *
  // * ---- SETUP ---- *
  // * --------------- *

  // A map for module names
  moduleNameMapper: {
    // "^@/(.*)$": "<rootDir>/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1", // ✅ Ahora apunta a `components/`
    "^@/components/ui/(.*)$": "<rootDir>/components/ui/$1", // ✅ Apunta a la carpeta `ui`
    "^@/components/stats/(.*)$": "<rootDir>/components/stats/$1", // ✅ Para componentes en `stats`
    "^@/components/skeletons/(.*)$": "<rootDir>/components/skeletons/$1", // ✅ Para `skeletons`
  },

  // Jest's base configuration
  preset: "ts-jest", // Para transformar TypeScript

  // Configure or set up the testing environment before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Matched files will skip transformation
  transformIgnorePatterns: ["/node_modules/"],

  // * ------------------ *
  // * ---- COVERAGE ---- *
  // * ------------------ *

  // Coverage information should be collected
  collectCoverage: true,

  // Output of coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // * --------------- *
  // * ---- MOCKS ---- *
  // * --------------- *

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Automatically reset mock state before every test
  resetMocks: true,

  // Automatically restore mock state and implementation before every test
  restoreMocks: true,

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // * -------------- *
  // * ---- MISC ---- *
  // * -------------- *

  // slowTestThreshold: 5,

  // verbose: undefined,
};

export default createJestConfig(config);
