import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

//Rutas publicas
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/', '/api(.*)'])

//Rutas con roles
const esRutaVendedor = createRouteMatcher(["/seller(.*)"]);
const esRutaComprador = createRouteMatcher(["/buyer(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}