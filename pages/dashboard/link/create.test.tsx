import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateLinkPage from './create'; // Adjust path as necessary
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as GeneratedHooks from '../../../hooks-generated'; // Import all generated hooks

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth/react (useSession is already auto-mocked via jest.config.js)
const mockUseSession = useSession as jest.Mock;

// Mock the useCreateLinkMutation hook
const mockActualMutateFn = jest.fn(); // This will be the first element of the tuple returned by the mock
let capturedMutationOptions: any; // To capture onCompleted, onError

jest.mock('../../../hooks-generated', () => {
  const originalModule = jest.requireActual('../../../hooks-generated');
  return {
    ...originalModule,
    useCreateLinkMutation: (options: any) => {
      capturedMutationOptions = options; // Capture the options passed to the hook
      return [mockActualMutateFn, { loading: false, error: null, data: undefined }]; // Return the mock mutate function and a result object
    },
  };
});


describe('CreateLinkPage - Feature Gating', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: {},
    });
    // Reset mocks for each test
    mockActualMutateFn.mockClear();
    mockActualMutateFn.mockResolvedValue({ data: { createLink: { id: 1 } } }); // Default successful resolution
    capturedMutationOptions = null;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Free Plan User', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: { user: { id: 'free-user', email: 'free@example.com', role: 'user', subscription_plan: 'free' } },
        status: 'authenticated',
      });
    });

    it('shows upgrade message and disables submit for premium link types', async () => {
      render(<CreateLinkPage />);

      // Select a premium type (e.g., youtube)
      const typeSelect = screen.getByLabelText(/Type/i) as HTMLSelectElement;
      fireEvent.change(typeSelect, { target: { value: 'youtube' } });

      expect(await screen.findByText(/The "youtube" link type is a premium feature. Please upgrade your plan./i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Upgrade Now/i })).toBeInTheDocument();

      const createButton = screen.getByRole('button', { name: /Create link/i });
      expect(createButton).toBeDisabled();

      // Attempt to submit (though button is disabled, good to double check)
      fireEvent.click(createButton);
      expect(mockActualMutateFn).not.toHaveBeenCalled(); // Changed mockCreateLink to mockActualMutateFn
    });

    it('allows creating non-premium link types', async () => {
      render(<CreateLinkPage />);

      const typeSelect = screen.getByLabelText(/Type/i) as HTMLSelectElement;
      fireEvent.change(typeSelect, { target: { value: 'vanilla' } }); // Non-premium

      expect(screen.queryByText(/is a premium feature/i)).not.toBeInTheDocument();

      const createButton = screen.getByRole('button', { name: /Create link/i });
      expect(createButton).not.toBeDisabled();

      fireEvent.change(screen.getByLabelText(/Label/i), { target: { value: 'My Vanilla Link' } });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockActualMutateFn).toHaveBeenCalledWith({
          variables: { label: 'My Vanilla Link', content: '', type: 'vanilla' },
        });
      });

      // Simulate onCompleted manually after the mutation is called
      if (capturedMutationOptions && capturedMutationOptions.onCompleted) {
        await waitFor(() => capturedMutationOptions.onCompleted({ createLink: { id: 1 } }));
      }

      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard/');
    });
  });

  describe('Pro Plan User', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: { user: { id: 'pro-user', email: 'pro@example.com', role: 'user', subscription_plan: 'pro' } },
        status: 'authenticated',
      });
    });

    it('allows creating premium link types without restriction', async () => {
      render(<CreateLinkPage />);

      const typeSelect = screen.getByLabelText(/Type/i) as HTMLSelectElement;
      fireEvent.change(typeSelect, { target: { value: 'youtube' } }); // Premium

      // No error message should appear
      expect(screen.queryByText(/is a premium feature/i)).not.toBeInTheDocument();

      const createButton = screen.getByRole('button', { name: /Create link/i });
      expect(createButton).not.toBeDisabled();

      fireEvent.change(screen.getByLabelText(/Label/i), { target: { value: 'My YouTube Video' } });
      fireEvent.change(screen.getByLabelText(/Content URL \/ Text/i), { target: { value: 'https://youtube.com/watch?v=123' } });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockActualMutateFn).toHaveBeenCalledWith({
          variables: { label: 'My YouTube Video', content: 'https://youtube.com/watch?v=123', type: 'youtube' },
        });
      });

      // Simulate onCompleted manually
      if (capturedMutationOptions && capturedMutationOptions.onCompleted) {
         await waitFor(() => capturedMutationOptions.onCompleted({ createLink: { id: 1 } }));
      }

       expect(mockRouterPush).toHaveBeenCalledWith('/dashboard/');
    });
  });
});
