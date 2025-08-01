const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('setupProxy.js is loaded'); // 添加调试信息

module.exports = function(app) {
    // 代理 /merchant 开头的请求
    app.use(
        '/merchant',
        createProxyMiddleware({
        target: 'http://jxgs-newos-merchantmanage.zhihuiyouzhan.com:81',
        changeOrigin: true,
        logLevel: 'debug'
        })
    );

    // 代理 /microservice-station 开头的请求
    app.use(
        '/microservice-station',
        createProxyMiddleware({
        target: 'http://jxgs-newos-station.zhihuiyouzhan.com:81',
        changeOrigin: true,
        logLevel: 'debug'
        })
    );
};