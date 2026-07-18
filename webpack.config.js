const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const REPO_ROOT = path.resolve(__dirname);

/**
 * Nest backend webpack override only (не для apps/client / Next).
 * TS6: paths без baseUrl в tsconfig → baseUrl только здесь, у плагина.
 * Nest всегда передаёт tsConfigPath проекта (api-gateway | auth-users | kino-db).
 */
function resolveTsConfigFile(options) {
  const fromPlugin = options.resolve?.plugins?.find(
    (plugin) => plugin?.constructor?.name === "TsconfigPathsPlugin",
  )?.configFile;
  if (fromPlugin) {
    return path.isAbsolute(fromPlugin)
      ? fromPlugin
      : path.resolve(REPO_ROOT, fromPlugin);
  }

  for (const rule of options.module?.rules || []) {
    const uses = Array.isArray(rule.use)
      ? rule.use
      : rule.use
        ? [rule.use]
        : rule.loader
          ? [{ loader: rule.loader, options: rule.options }]
          : [];
    for (const use of uses) {
      if (!use || typeof use !== "object") continue;
      const loader = String(use.loader || "");
      if (loader.includes("ts-loader") && use.options?.configFile) {
        const configFile = use.options.configFile;
        return path.isAbsolute(configFile)
          ? configFile
          : path.resolve(REPO_ROOT, configFile);
      }
    }
  }

  throw new Error(
    "webpack.config.js: Nest не передал tsconfig (ожидался TsconfigPathsPlugin.configFile или ts-loader options.configFile)",
  );
}

module.exports = function (options) {
  const resolvePlugins = (options.resolve?.plugins || []).filter(
    (plugin) => plugin?.constructor?.name !== "TsconfigPathsPlugin",
  );

  resolvePlugins.push(
    new TsconfigPathsPlugin({
      configFile: resolveTsConfigFile(options),
      baseUrl: REPO_ROOT,
    }),
  );

  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        ...(options.resolve?.alias || {}),
        "@common": path.join(REPO_ROOT, "apps/common"),
      },
      plugins: resolvePlugins,
    },
  };
};
