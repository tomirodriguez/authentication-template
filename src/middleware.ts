import { auth } from "@/server/auth";

export default auth((req) => {
  console.log("IS LOGGED", !!req.auth);
  // req.auth
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
