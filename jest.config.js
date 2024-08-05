module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'html', 'text'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/**/*.mock.ts',
  ],
};