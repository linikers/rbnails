webpack: (config, { isServer }) => {
  // Configura o Sass
  config.module.rules.push({
    test: /\.scss$/,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        options: {
          sassOptions: {
            includePaths: [path.join(__dirname, "styles")],
          },
        },
      },
    ],
  });

  // Configura o CSS
  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: "style-loader",
      },
      {
        loader: "css-loader",
        options: {
          esModule: false,
          importLoaders: 1,
        },
      },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              [
                "autoprefixer",
                {
                  // Configura as regras do autoprefixer
                  overrideBrowserslist: ["last 2 version", ">1%", "ie >= 11"],
                },
              ],
            ],
          },
        },
      },
    ],
  });

  // Configura o File Loader para lidar com arquivos de fonte
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "static/fonts/",
          publicPath: "/_next/static/fonts/",
        },
      },
    ],
  });

  // Redireciona a pasta static
  if (!isServer) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, "static"),
            to: path.join(__dirname, "public", "_next", "static"),
          },
        ],
      })
    );
  }

  return config;
};
