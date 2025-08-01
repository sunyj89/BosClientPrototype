const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log('✅ setupProxy.js 已加载'); // 关键验证点

    console.log('✅ setupProxy.js 已加载'); // 关键验证点

    console.log('✅ setupProxy.js 已加载-------'); // 关键验证点

    app.use(
        '/merchant',
        createProxyMiddleware({
            target: 'http://jxgs-newos-merchantmanage.zhihuiyouzhan.com:81',
            changeOrigin: true,
            logLevel: 'debug'
        })
    );

    // app.use(createProxyMiddleware(
    //     '/merchant',
    //     {
    //         target: 'http://jxgs-newos-merchantmanage.zhihuiyouzhan.com:81',
    //         changeOrigin: true,
    //         logLevel: 'debug'
    //     }
    // ),createProxyMiddleware(
    //     '/microservice-station',
    //     {
    //         target: 'http://jxgs-newos-station.zhihuiyouzhan.com:81',
    //         changeOrigin: true,
    //         logLevel: 'debug'
    //     }
    // ));
};