// pages/dashboard/_middleware.ts
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const auth = getAuth();
  const user = auth.currentUser;

  // Check if the user is logged in
  if (user) {
    // If logged in, allow access to the page
    return NextResponse.next();
  } else {
    // If not logged in, redirect to the landing page
    return NextResponse.redirect(new URL('/', req.url));
  }
}
