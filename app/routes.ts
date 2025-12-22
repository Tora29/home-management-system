import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home/route.tsx"),
  route("/users", "routes/users/route.tsx"),
] satisfies RouteConfig;
