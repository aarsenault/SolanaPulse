import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom", // sets test environment to browser and provides a 'window' object
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: [
    "ts-node/register",
    "@testing-library/jest-dom/extend-expect",
  ],
};

export default config;
