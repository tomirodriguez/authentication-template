/**
 * An array of routes that are accesible to the public.
 * This routes do not require authentication.
 */
export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication.
 * This routes will redirect logged in users to /settings
 */
export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
