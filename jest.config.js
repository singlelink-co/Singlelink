const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle CSS imports (e.g., if you import CSS files in your components)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases (this will be automatically configured by next/jest)
    // Example: '^@/components/(.*)$': '<rootDir>/components/$1',
    // The below are examples if you have specific aliases not covered by Next.js default paths
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/hooks-generated$': '<rootDir>/hooks-generated.ts',
     // Mock next-auth/react - this might still be needed if next/jest doesn't handle it as expected
    '^next-auth/react$': '<rootDir>/__mocks__/next-auth-react.js',
  },
  // If using TypeScript with a baseUrl set to the root directory, you need the below for robust path resolving
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  // No need for explicit 'preset: ts-jest' or 'transform' for ts-jest when using next/jest
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
