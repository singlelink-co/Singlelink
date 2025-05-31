// __mocks__/next-auth-react.js
const actualNextAuth = jest.requireActual('next-auth/react');

module.exports = {
  ...actualNextAuth,
  useSession: jest.fn(() => ({
    data: null, // Default: no session
    status: 'unauthenticated', // Default: unauthenticated
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  // Mock any other exports from 'next-auth/react' you use
};
