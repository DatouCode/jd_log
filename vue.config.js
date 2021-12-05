module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: "https://api.jdsharecode.xyz/api/",
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}