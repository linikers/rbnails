import { Html, Head, Main, NextScript } from "next/document";
import { Container } from "reactstrap";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        <title>Rafa Bach | Manicure em Maringá-PR</title>
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
