const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const fs = require("fs");
const { Readable } = require("stream");

const generateSitemap = async () => {
  const baseUrl = "https://rafabachnails.vercel.app/";
  const links = [
    // Adicione aqui as rotas que você deseja incluir no sitemap
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/contato", changefreq: "monthly", priority: 0.8 },
    { url: "/servicos", changefreq: "monthly", priority: 0.6 },
    { url: "/sobre", changefreq: "monthly", priority: 0.6 },
    // ...
  ];

  const stream = new SitemapStream({ hostname: baseUrl });
  const pipeline = stream.pipe(createGzip());

  links.forEach((link) => {
    stream.write(link);
  });

  stream.end();

  const sitemap = await streamToPromise(pipeline);
  fs.writeFileSync("./public/sitemap.xml.gz", sitemap);
  console.log("Sitemap gerado com sucesso!");
};

generateSitemap().catch((error) => {
  console.error("Erro ao gerar o sitemap:", error);
});
