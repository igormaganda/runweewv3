import { User, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use the status text or a generic message
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User }> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async getMe(): Promise<{ user: User }> {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      let errorMessage = 'Not authenticated';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = `Session error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }
};
