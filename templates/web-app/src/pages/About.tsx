export function About() {
  return (
    <div className="panel prose">
      <p className="eyebrow">About</p>
      <h1 className="heading">A notes app in one page</h1>
      <p>
        A single-page app built with Vite and React. The server sends <code>index.html</code> once; after that,
        React draws every page in the browser and the address bar follows along.
      </p>
      <h2 className="subheading">How it's put together</h2>
      <ul className="files">
        <li>
          <code>src/router.tsx</code>
          <span>A small history router. Orbit's SPA fallback serves <code>index.html</code> for any path, so a link straight to a note works.</span>
        </li>
        <li>
          <code>src/notes.ts</code>
          <span>The notes, kept in <code>localStorage</code>. Replace its functions with calls to your API and the pages stay the same.</span>
        </li>
        <li>
          <code>src/pages/</code>
          <span>One component per page.</span>
        </li>
        <li>
          <code>src/orbit.css</code>
          <span>Orbit's tokens and components: panels, buttons, badges, light and dark. <code>src/index.css</code> is this app's layout.</span>
        </li>
      </ul>
    </div>
  );
}
