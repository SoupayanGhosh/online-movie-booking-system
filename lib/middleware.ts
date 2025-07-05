import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCsrfToken, verifyCsrfToken } from './csrf';

export function csrfMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Skip CSRF check for GET requests
    if (req.method === 'GET') {
      return handler(req);
    }

    const csrfToken = req.headers.get('X-CSRF-Token');

    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        { status: 403 }
      );
    }

    if (!verifyCsrfToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    return handler(req);
  };
}
