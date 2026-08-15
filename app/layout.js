export const metadata = {
  title: "Ase Football AI — Smart Match Predictor",
  description: "AI-powered football match predictions across 100+ betting markets",
  manifest: "/manifest.json",
  themeColor: "#080e16",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ase Football AI" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#080e16" }}>
        {children}
      </body>
    </html>
  );
}
