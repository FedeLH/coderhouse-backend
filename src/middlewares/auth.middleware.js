const authSession = (req, res, next) => {
  const isLoggedIn = req.session?.passport?.user !== undefined;
  const isLoggingIn =
    req.path === "/login" ||
    req.path === "/api/sessions/login" ||
    req.path === "/api/sessions/github" ||
    req.path === "/api/sessions/githubcallback" ||
    req.path === "/api/sessions/failedlogin";
  const isRegistering =
    req.path === "/register" ||
    req.path === "/api/sessions/register" ||
    req.path === "/api/sessions/failedregister";

  if ((isLoggingIn || isRegistering) && isLoggedIn) return res.redirect("/");

  if (!isLoggedIn && !(isLoggingIn || isRegistering))
    return res.redirect("/login");

  next();
};

export default authSession;
