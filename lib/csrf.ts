import { randomBytes } from 'crypto';

// Generate a new CSRF token
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

// Set CSRF token in cookie (server-side)
export function setCsrfCookie(token: string): void {
  if (typeof document !== 'undefined') {
    document.cookie = `csrfToken=${token}; path=/`;
  }
}

// Get CSRF token from cookie (client or server)
export function getCsrfTokenFromCookie(req?: any): string | null {
  let cookieString = '';
  if (typeof document !== 'undefined') {
    cookieString = document.cookie;
  } else if (req && req.headers && req.headers.get) {
    cookieString = req.headers.get('cookie') || '';
  } else if (req && req.headers && req.headers.cookie) {
    cookieString = req.headers.cookie;
  }
  const match = cookieString.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Verify CSRF token (compare header to cookie)
export function verifyCsrfToken(headerToken: string, req?: any): boolean {
  const cookieToken = getCsrfTokenFromCookie(req);
  return !!headerToken && !!cookieToken && headerToken === cookieToken;
} 