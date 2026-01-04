import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/_index/route.tsx"),
  route("/login", "routes/login/route.tsx"),
  route("/register", "routes/register/route.tsx"),
  route("/password-reset", "routes/password-reset/route.tsx"),
  route("/password-reset/:token", "routes/password-reset-confirm/route.tsx"),
] satisfies RouteConfig;
