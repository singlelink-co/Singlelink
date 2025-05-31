import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './login'; // Adjust path if your file is elsewhere
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react
// signIn is already mocked via moduleNameMapper in jest.config.js pointing to __mocks__/next-auth-react.js
// useSession is also mocked via the same mechanism.

describe('LoginPage', () => {
  let mockRouterPush: jest.Mock;
  let mockSignIn = signIn as jest.Mock; // Get the auto-mocked version
  let mockUseSession = useSession as jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: {}, // Default empty query
    });
    mockSignIn.mockClear();
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' }); // Default to unauthenticated
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Login to your LaunchLinks/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('allows typing into email and password fields', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
  });

  it('calls signIn with credentials and redirects on successful login', async () => {
    mockSignIn.mockResolvedValueOnce({ ok: true, error: null, url: '/dashboard' });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message if signIn returns an error', async () => {
    const errorMessage = 'Invalid credentials';
    mockSignIn.mockResolvedValueOnce({ ok: false, error: errorMessage, url: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('redirects to dashboard if already authenticated', () => {
    mockUseSession.mockReturnValue({ data: { user: { email: 'test@example.com', role: 'user' } }, status: 'authenticated' });
    render(<LoginPage />);
    expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
  });

   it('shows loading state when session status is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });
    render(<LoginPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays message from query params', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: { message: 'Registration successful. Please log in.' },
    });
    render(<LoginPage />);
    expect(screen.getByText('Registration successful. Please log in.')).toBeInTheDocument();
  });

});
