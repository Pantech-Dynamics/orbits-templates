// Link-preview image tags for every page (the card size is twitter in metadata). og:image wants a full address: SITE_URL when it's set, else a relative
// path. They're written by hand because Next resolves a relative image against localhost without metadataBase.
const SITE_URL = (process.env.SITE_URL ?? "").replace(/\/$/, "");

export function OpenGraph({ alt }: { alt: string }) {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${SITE_URL}/og.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={alt} />
    </>
  );
}
