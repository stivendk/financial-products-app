module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist/"
    ],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
        astTransformers: {
          before: [
            'jest-preset-angular/build/InlineFilesTransformer',
            'jest-preset-angular/build/StripStylesTransformer'
          ]
        }
      }
    },
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    transform: {
      '^.+\\.(ts|js|html|mjs)$': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
  };
  