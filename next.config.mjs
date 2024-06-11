/** @type {import('next').NextConfig} */
import withTM from "next-transpile-modules";
const withTranspileModules = withTM(["@pqina/pintura", "@pqina/react-pintura"]);
const nextConfig = withTranspileModules({
  reactStrictMode: false,
  env: {
    DBCONNECTIONSTRING: "mongodb://localhost:27017/",
    AUTH_SECRET: "Ij14WxgNNUp2dyp5",
  },
});

export default nextConfig;
