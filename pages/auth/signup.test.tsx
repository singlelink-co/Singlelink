import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './signup'; // Adjust path if your file is elsewhere
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe('SignupPage', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: {}, // Mock query params if your component uses them
    });
    // Reset fetch mock before each test
    (fetch as jest.Mock).mockClear();
  });

  it('renders the signup form correctly', () => {
    render(<SignupPage />);
    expect(screen.getByRole('heading', { name: /Create your Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('allows typing into form fields', () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
  });

  it('submits the form and calls the registration API, then redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User created successfully.' }),
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' }),
      });
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/auth/login?message=Registration successful. Please log in.');
    });
  });

  it('displays an error message if registration API call fails', async () => {
    const errorMessage = 'Email already exists.';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'taken@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('requires email and password', async () => {
    render(<SignupPage />);
    // Password is required by the input field itself
    // Email is required by the input field itself

    // Test submitting with empty password (HTML5 validation might prevent this, but good to check handling)
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    // Click without password
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // We might not see a custom error if HTML5 validation kicks in first.
    // This test is more about ensuring the form doesn't submit and call fetch.
    await waitFor(() => {
        // Check if an error related to password requirement is shown, or if fetch was NOT called
        // For this basic test, we'll ensure fetch wasn't called without password.
         expect(fetch).not.toHaveBeenCalled();
    });

    // Test submitting with empty email
    (fetch as jest.Mock).mockClear(); // Clear previous mock state if any
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
         expect(fetch).not.toHaveBeenCalled();
    });
  });
});
