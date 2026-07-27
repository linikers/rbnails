import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        {/* PWA: captura beforeinstallprompt antes do React hidratar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__pwaPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__pwaPrompt = e;
              });
            `,
          }}
        />
        {/* PWA — manifest + iOS */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4876" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* iOS splash screen + icons em tamanhos corretos */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-167.png" />
        <meta name="apple-mobile-web-app-title" content="RB Nails" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        <meta
          name="description"
          content="Rafa Bach é uma manicure profissional em Maringá-PR. Oferecemos serviços de manicure, pedicure e design de unhas. Agende seu horário agora!"
        />
        <meta
          property="og:title"
          content="Rafa Bach | Manicure em Maringá-PR"
        />
        <meta
          property="og:description"
          content="Rafa Bach é uma manicure profissional em Maringá-PR. Oferecemos serviços de manicure, pedicure e design de unhas. Agende seu horário agora!"
        />
        <meta property="og:url" content="https://rafabach.com.br/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:region" content="Maringá-PR" />
        <meta property="og:service" content="Manicure" />
        <meta property="og:service" content="pedicure" />
        <meta property="og:service" content="Nail Design" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
