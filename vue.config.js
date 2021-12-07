module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: "http://47.243.232.158:10001",
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}