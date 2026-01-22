export const getSubdomain = () => {
  const host = window.location.hostname;

  // admin.localhost
  if (host.startsWith("admin.")) {
    return "admin";
  }
  // localhost OR example.com
  return "user";
};
