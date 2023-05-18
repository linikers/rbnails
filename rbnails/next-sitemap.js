(async () => {
  const { default: sitemap } = await import("next-sitemap/dist/index");

  const generateSitemap = async () => {
    const options = {
      siteUrl: "https://rafabachnails.vercel.app/",
    };

    return sitemap(options);
  };

  try {
    await generateSitemap();
    console.log("Sitemap gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar o sitemap:", error);
  }
})();
