import { logger } from "../utils/logger.js";

const authSession = (req, res, next) => {
  const isLoggedIn = Array.isArray(req.user);
  const isValidPath =
    /^\/(login|register|forgot-password|error|success)$/.test(req.path) ||
    /^\/reset-password\/\w+$/.test(req.path) ||
    /^\/api\/sessions\/(login|github|githubcallback|faillogin|register|failregister)$/.test(req.path) ||
    /^\/api\/passwords\/\w+$/.test(req.path);

  if (isValidPath && isLoggedIn) return res.redirect("/");

  if (!isLoggedIn && !isValidPath)
    return res.redirect("/login");
  next();
};

export default authSession;
