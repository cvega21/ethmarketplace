/** @type {import('next').NextConfig} */
// next.config.js
const withTM = require('next-transpile-modules')(['firebase', 'firebase-admin']); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
});
