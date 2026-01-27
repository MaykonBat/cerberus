const nextConfig = {
  transpilePackages: ["commons"],
  env: {
    AUTH_MSG: process.env.AUTH_MSG,
    CERBERUS_PAY_CONTRACT: process.env.CERBERUS_PAY_CONTRACT
  }
};

module.exports = nextConfig;