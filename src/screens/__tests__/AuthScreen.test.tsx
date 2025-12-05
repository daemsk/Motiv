import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthScreen } from '../AuthScreen';
import { useAuth } from '@/hooks';

// Mock the useAuth hook
jest.mock('@/hooks', () => ({
  useAuth: jest.fn(),
}));

describe('AuthScreen', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      loading: false,
    });
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    expect(getByText('Welcome to Motiv')).toBeTruthy();
    expect(getByText('Sign in with your email to get started')).toBeTruthy();
    expect(getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(getByText('Sign in with Magic Link')).toBeTruthy();
  });

  it('shows validation error for empty email', () => {
    const { getByText } = render(<AuthScreen />);

    const signInButton = getByText('Sign in with Magic Link');
    fireEvent.press(signInButton);

    expect(getByText('Email is required')).toBeTruthy();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', () => {
    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    const emailInput = getByPlaceholderText('you@example.com');
    fireEvent.changeText(emailInput, 'invalid-email');

    const signInButton = getByText('Sign in with Magic Link');
    fireEvent.press(signInButton);

    expect(getByText('Please enter a valid email address')).toBeTruthy();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn with valid email', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    const emailInput = getByPlaceholderText('you@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    const signInButton = getByText('Sign in with Magic Link');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success message after magic link sent', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const { getByPlaceholderText, getByText, findByText } = render(<AuthScreen />);

    const emailInput = getByPlaceholderText('you@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    const signInButton = getByText('Sign in with Magic Link');
    fireEvent.press(signInButton);

    const successTitle = await findByText('Check your email');
    expect(successTitle).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
  });

  it('shows loading state while signing in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      loading: true,
    });

    const { getByText } = render(<AuthScreen />);

    const signInButton = getByText('Sign in with Magic Link');
    expect(signInButton).toBeTruthy();
  });
});
