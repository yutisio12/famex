module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,

        // Node.js modules → browser TIDAK BUTUH
        fs: false,
        path: false,
        crypto: false,
        util: false,
      };

      return config;
    },
  },
};
