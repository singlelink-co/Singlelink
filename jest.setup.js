// jest.setup.js
require('@testing-library/jest-dom');

// Optional: If you need to mock other global objects or setup other test utilities, do it here.
// For example, mocking Next.js router (though it's often done per-test or in a __mocks__ folder)
/*
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));
*/

// Mock `next-auth/react` globally for all tests if needed, or do it per test file.
// The moduleNameMapper in jest.config.js might handle this more broadly.
/*
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: null, status: 'unauthenticated' }; // Default mock
    }),
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});
*/

// If you use a global fetch mock, you can set it up here.
// import fetchMock from 'jest-fetch-mock';
// fetchMock.enableMocks();
