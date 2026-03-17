import { User, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    console.log('authService: login attempt for', credentials.email);
    const origin = window.location.origin;
    const url = `${origin}/api/auth/login`;
    console.log('Fetching URL:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errorMessage = 'Login failed';
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } catch (e) {
            errorMessage = `Server error: ${response.status}`;
          }
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text.substring(0, 100));
          errorMessage = `Server error: ${response.status} ${response.statusText}. The server returned HTML instead of JSON.`;
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        const text = await response.text();
        console.error('Expected JSON but got:', text.substring(0, 100));
        throw new Error('Server returned non-JSON response (200 OK but HTML). Check API route configuration.');
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. The server is taking too long to respond.');
      }
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User }> {
    const origin = window.location.origin;
    const url = `${origin}/api/auth/register`;
    console.log('authService: register attempt for', credentials.email);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      if (contentType && contentType.includes('application/json')) {
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON error response:', text.substring(0, 100));
        errorMessage = `Server error: ${response.status}. The server returned HTML instead of JSON.`;
      }
      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      const text = await response.text();
      console.error('Expected JSON but got:', text.substring(0, 100));
      throw new Error('Server returned non-JSON response.');
    }
  },

  async logout(): Promise<void> {
    const origin = window.location.origin;
    const url = `${origin}/api/auth/logout`;
    await fetch(url, { method: 'POST' });
  },

  async getMe(): Promise<{ user: User }> {
    const origin = window.location.origin;
    const url = `${origin}/api/auth/me`;
    const response = await fetch(url);
    
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = 'Not authenticated';
      if (contentType && contentType.includes('application/json')) {
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Session error: ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      throw new Error('Invalid session response');
    }
  }
};
