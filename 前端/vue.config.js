// 最初始
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,


    //使之能在手机调试
    // devServer: {
    //     host: '192.168.42.25',  // 将浏览地址的本地服务修改为本机ip地址，用来到手机上测试
    //     // port: 8080,           //端口号
    // },
    //初始是注释掉的
    devServer: {
        proxy: {
            '/api':{
                target: 'http://localhost:3000',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
    
}

// const path = require('path')

// module.exports = {  
//   // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
//   publicPath: './',  
//   // 输出文件目录
//   outputDir: 'dist',  
//   // eslint-loader 是否在保存的时候检查
//   lintOnSave: true,  
//   // 是否使用包含运行时编译器的 Vue 构建版本
//   runtimeCompiler: false,  
//   // 生产环境是否生成 sourceMap 文件
//   productionSourceMap: false,  
//   // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
//   integrity: false,  
//   // webpack相关配置
//   chainWebpack: (config) => {
//     config.resolve.alias
//       .set('vue$', 'vue/dist/vue.esm.js')
//       .set('@', path.resolve(__dirname, './src'))
//   },
//   configureWebpack: (config) => {    
//   if (process.env.NODE_ENV === 'production') {      
//       // 生产环境
//       config.mode = 'production'
//     } else {      
//       // 开发环境
//       config.mode = 'development'
//     }
//   },  
//   // css相关配置
//   css: {    
//     // 是否分离css（插件ExtractTextPlugin）
//     extract: true,    
//     // 是否开启 CSS source maps
//     sourceMap: false,   
//     // css预设器配置项
//     loaderOptions: {},    
//     // 是否启用 CSS modules for all css / pre-processor files.
//     modules: false
//   },  
//   // 是否使用 thread-loader
//   parallel: require('os').cpus().length > 1, 
//   // PWA 插件相关配置
//   pwa: {}, 
//   // webpack-dev-server 相关配置
//   devServer: {
//     open: true,
//     host: '47.112.182.67',
//     port: 3000,
//     https: false,
//     hotOnly: false,   
//     // http 代理配置
//     proxy: {      
//       '/api': {
//         target: 'http://127.0.0.1:3000/api/',
//         changeOrigin: true,
//         pathRewrite: {          
//             '^/api': ''
//         }
//       }
//     },
//     before: (app) => {}
//   }, 
//   // 第三方插件配置
//   pluginOptions: {

//   }
// }