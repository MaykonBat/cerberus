const nextConfig = {
  transpilePackages: ["commons"],
  env: {
    AUTH_MSG: process.env.AUTH_MSG,
    CERBERUS_PAY_CONTRACT: process.env.CERBERUS_PAY_CONTRACT,
    BACKEND_URL: process.env.BACKEND_URL
  }
};

module.exports = nextConfig;