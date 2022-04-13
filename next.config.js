/** @type {import('next').NextConfig} */

const Dotenv = require("dotenv-webpack");


const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new Dotenv({ silent: true }));
    return config;
},
env: {
    env: process.env.env,
    TITLE: process.env.TITLE,
    TOKEN_ID: process.env.TOKEN_ID,
    SAMPLE_TOKEN: process.env.SAMPLE_TOKEN,
    API_URL: process.env.API_URL,
},
}

module.exports = nextConfig
