export function About() {
  return (
    <div className="prose">
      <h1>About</h1>
      <p>
        A single-page app built with Vite and React. The server sends <code>index.html</code> once; after that,
        React draws every page in the browser and the address bar follows along.
      </p>
      <h2>How it's put together</h2>
      <ul>
        <li>
          <code>src/router.tsx</code>: a small history router. Orbit's SPA fallback serves <code>index.html</code> for
          any path, so a link straight to a note works.
        </li>
        <li>
          <code>src/notes.ts</code>: the notes, kept in <code>localStorage</code>. Replace its functions with calls to your
          API and the pages stay the same.
        </li>
        <li>
          <code>src/pages/</code>: one component per page.
        </li>
      </ul>
    </div>
  );
}
