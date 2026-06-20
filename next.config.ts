// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       new URL("http://localhost:1337/**"),
//       new URL("https://wzh-backend.onrender.com/**"),
//     ],
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
};
module.exports = nextConfig;