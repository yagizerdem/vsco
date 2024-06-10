/** @type {import('next').NextConfig} */
import withTM from "next-transpile-modules";
const withTranspileModules = withTM(["@pqina/pintura", "@pqina/react-pintura"]);
const nextConfig = withTranspileModules({
  reactStrictMode: true,
  env: {
    DBCONNECTIONSTRING: "mongodb://localhost:27017/",
  },
});

export default nextConfig;
