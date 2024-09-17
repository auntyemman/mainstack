import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  detectOpenHandles: true,
  rootDir: 'src',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['**/src/**/*.spec.ts'],
  modulePathIgnorePatterns: ['./dist'],
};

export default config;
