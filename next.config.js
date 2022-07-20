
const webpack = require('webpack')

module.exports = {
  env: {
    NEXT_JS_API_URL_PROD: process.env.NEXT_JS_API_URL_PROD,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  }
}
