import { Injectable } from '@angular/core';

const STORAGE_KEY = 'access_token';
/** Buffer in ms before exp to consider token expired (e.g. 10s) */
const EXPIRY_BUFFER_MS = 10_000;

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      try {
        localStorage.setItem(STORAGE_KEY, token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Returns the token from memory or localStorage if it exists and is not expired.
   * If expired or missing, clears storage and returns null.
   */
  getToken(): string | null {
    if (this.token !== null) {
      if (this.isTokenExpired(this.token)) {
        this.setToken(null);
        return null;
      }
      return this.token;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      if (this.isTokenExpired(stored)) {
        this.setToken(null);
        return null;
      }
      this.token = stored;
      return stored;
    } catch {
      return null;
    }
  }

  /**
   * Reads token from localStorage only (for session restore). Does not validate expiry.
   * Returns null if not found.
   */
  getStoredToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  clearToken(): void {
    this.token = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodePayload(token);
      if (!payload?.exp) return true;
      const expMs = payload.exp * 1000;
      return Date.now() >= expMs - EXPIRY_BUFFER_MS;
    } catch {
      return true;
    }
  }

  /**
   * Decodes JWT payload (no signature verification; used for exp and user info in app).
   */
  decodePayload(token: string): { sub?: string; email?: string; role?: string; exp?: number } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json) as { sub?: string; email?: string; role?: string; exp?: number };
    } catch {
      return null;
    }
  }
}
