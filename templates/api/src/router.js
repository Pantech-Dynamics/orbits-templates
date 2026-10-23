/** A route for `method` and a path like "/items/:id"; match() returns the handler and params, or null. */
export function route(method, path, handler) {
  const names = [];
  const pattern = new RegExp(
    "^" +
      path.replace(/:(\w+)/g, (_, name) => {
        names.push(name);
        return "([^/]+)";
      }) +
      "/?$",
  );
  return {
    match(requestMethod, pathname) {
      const found = pattern.exec(pathname);
      if (!found || (requestMethod !== undefined && requestMethod !== method)) return null;
      const params = Object.fromEntries(names.map((name, i) => [name, decodeURIComponent(found[i + 1])]));
      return { handler, params };
    },
  };
}
