//import { DEFAULT_ECDH_CURVE } from "tls";

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin")
//chunk代码块

const CopyWebpackPlugin = require("copy-webpack-plugin");

const cssExtract =  new ExtractTextWebpackPlugin("css/index.css"); //用于生成一个目录，然后在loader中将最后的文件导入进去
const lessExtract = new ExtractTextWebpackPlugin("less/less.css");
const sassExtract = new ExtractTextWebpackPlugin("sass/sass.css");

module.exports = {
    //从每一个模块出发，加载依赖，然后生成chunk，chunk回被文件系统写入生成asset
    entry : {
       index: "./src/index.js", 
       main: "./src/main.js"
      // common: "./src/jquery.js"
    },//入口，相对路径
    output: {
        path: path.join(__dirname, "dist"), //保存的绝对路径，输出的文件夹
        //filename: "boundle.js" //打包后的文件名
        //方法二：filename还可以是如下形式，name是entry的名字，hash是文件内容经过hash函数的值
        filename: '[name].[hash:8].js' 
    },
    watch: true, //当watch为true时，那么就会主动监听源文件的变化，并且重新打包，编译
    watchOptions: {
        ignored: "", //忽视的源文件 不在监听的范围内
        poll: 1000, //表示1秒内的查询次数，次数越多那么越消耗性能
        aggregateTimeout: 500 //这个和节流差不多

    },
    module: {//配置loader，用来解析模块
        rules: [
            {
                test: /\.css$/,//用正则来匹配文件
                //解析css需要css-loader 将css模块
                //style-loader 将css文件变成一个style标签，插入html中
               // loader: ["style-loader", "css-loader"] //定义转化器
                //如果使用cssExtract，那么最后一步就不需要style-loader了，
                use: cssExtract.extract(['css-loader', "postcss-loader"]) 
            }, {
                //用于处理任意的二进制文件，拷贝到新的文件
                test: /\.(png|jpg|gif|svg)/,
                loader: {
                    loader: "file-loader",
                    options: {//指定输出文件目录
                        outputPath: "image/"
                    
                }
                // loader: {
                //     loader: "url-loader", //如何使用url-loader，那么就可以把小的文件直接转化成base64格式，然后内嵌到html中
                //     options: {
                //         limit: 680 * 1024,
                //         outputPath: "image/"
                //     }
                }
            }, {
                test: /\.(html|htm)/,
                loader: "html-withimg-loader"
            }, { //对less进行处理
                test: /\.less$/,
               // loader: ["style-loader", "css-loader", "less-loader"]
                use: lessExtract.extract(["css-loader", "less-loader"])
                //同理less转化为css也不需要在使用style-loader插入html了
            }, {//对sass进行处理
                test: /\.scss/,
               // loader: ["style-loader", "css-loader", "sass-loader"]
                use: sassExtract.extract(["css-loader", "sass-loader"])
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin.ProviderPlugin({
        //     $: 'jqurey'
        // }),
        new UglifyjsWebpackPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "cylnb", //html的title
            template: "./src/index.html", //模板html的来源
            filename: "index.html", //产出的html文件名，在output目录下
            hash: true, //放在走缓存
            chunks: ["main", "index"] //规则加载的js文件，如果没写，那么就加载全部,那么此处加载index所形成的chunk
        }),
        new CopyWebpackPlugin([
            { from: path.join(__dirname, "public"),
              to: path.join(__dirname, "dist", "public")
            }
        ]),
        cssExtract, //用于生成一个目录，然后在loader中将最后的文件导入进去
        lessExtract,
        sassExtract
        
    ],
    devServer: { //服务器模块 给webpack-dev-server配置，可以预览打包后的项目
        contentBase: "./dist", //文件根目录
        host: "localhost", //主机
        port: 8080, //端口
        compress: true, //服务器返回给浏览器的时候是否使用gzip打包
    }
    //前六个文件是往index.js里面注入一个客户端，websocket用来监听文件变化的,刷新浏览器拿到最新的结果

}

//expose-loader会引入当前模块，而且会把导出对象挂载到window对象上，
//webpack.ProviderPlugin用于在每个模块中注入变量

//extract-text-webpack-plugin //用于对文件分类  将包中的文本提取到单独的文件中


//less less-loader(依赖less)对less转化为css
//node-sass sass-loader(依赖node-sass)把sass转化为css



//postcss 用来处理css文件 配置postcss.config.js 加载css添加loader
//autoprefixer用来自动给css加兼容浏览器得前缀-o(opera) -moz(firefox) -webkit(chrome safari) -ms(ie)


//配置bebal可以成功编译es6 es7 react等 核心模块babel-loader bable-core等

//配置devtool: source-map || cheap-module-source-map等可以在开发模式下，准确获取报错位置




//其他文件，譬如.pdf .txt 等没办法形成模块化，那么就可以利用copy-webpack-plugin实现拷贝操作

//如果想要css加载时压缩，那么只需要在css-loader后面加上minimize